import os, subprocess, time, json, requests
from fastapi import FastAPI, HTTPException, BackgroundTasks
from pydantic import BaseModel

# ---------- CONFIG (edit for your setup) ----------
ARGOCD_URL = "https://argocd.example.com/api/v1"
ARGOCD_TOKEN = "YOUR_ARGOCD_TOKEN"
PROMETHEUS_URL = "http://prometheus.default.svc:9090"
SLACK_WEBHOOK = "https://hooks.slack.com/services/XXX/YYY/ZZZ"
TERRAFORM_BIN = "terraform"                # must be in PATH
TERRAFORM_WORKDIR = "./terraform-demo"     # path to Terraform configs

# --------------------------------------------------
app = FastAPI(title="Developer Self-Service Portal")

headers_argocd = {"Authorization": f"Bearer {ARGOCD_TOKEN}",
                  "Content-Type": "application/json"}

class DeployRequest(BaseModel):
    app_name: str
    revision: str | None = None

class ProvisionRequest(BaseModel):
    env_name: str
    variables: dict | None = None


# ---------- HELPERS ----------
def slack(msg: str):
    """Send message to Slack (non-blocking, ignore errors)."""
    try:
        requests.post(SLACK_WEBHOOK, json={"text": msg}, timeout=5)
    except Exception as e:
        print("Slack send failed:", e)


# ---------- DEPLOY ----------
@app.post("/deploy")
def deploy(req: DeployRequest, bg: BackgroundTasks):
    url = f"{ARGOCD_URL}/applications/{req.app_name}/sync"
    body = {"revision": req.revision} if req.revision else {}
    r = requests.post(url, headers=headers_argocd, json=body, timeout=10)
    if r.status_code not in (200, 202):
        raise HTTPException(status_code=500, detail=f"ArgoCD sync failed: {r.text}")
    bg.add_task(slack, f"🚀 Deploy started for *{req.app_name}* (rev {req.revision or 'HEAD'})")
    return {"ok": True, "message": "Deployment triggered", "argo": r.json()}


# ---------- ROLLBACK ----------
@app.post("/rollback")
def rollback(app_name: str, revision: str, bg: BackgroundTasks):
    url = f"{ARGOCD_URL}/applications/{app_name}/sync"
    r = requests.post(url, headers=headers_argocd, json={"revision": revision}, timeout=10)
    if r.status_code not in (200, 202):
        raise HTTPException(status_code=500, detail=f"Rollback failed: {r.text}")
    bg.add_task(slack, f"↩️ Rollback requested for *{app_name}* → {revision}")
    return {"ok": True, "message": "Rollback triggered"}


# ---------- STATUS ----------
@app.get("/status/{app_name}")
def status(app_name: str):
    url = f"{ARGOCD_URL}/applications/{app_name}"
    r = requests.get(url, headers=headers_argocd, timeout=8)
    if r.status_code != 200:
        raise HTTPException(status_code=404, detail="Application not found")
    data = r.json()
    return {
        "name": data.get("metadata", {}).get("name"),
        "sync": data.get("status", {}).get("sync", {}),
        "health": data.get("status", {}).get("health", {}),
        "operation": data.get("status", {}).get("operationState", {}),
    }


# ---------- PROMETHEUS QUERY ----------
@app.get("/metrics")
def metrics(query: str):
    r = requests.get(f"{PROMETHEUS_URL}/api/v1/query", params={"query": query}, timeout=8)
    if r.status_code != 200:
        raise HTTPException(status_code=500, detail=f"Prometheus query failed: {r.text}")
    return r.json()


# ---------- TERRAFORM PROVISION ----------
@app.post("/provision")
def provision(req: ProvisionRequest, bg: BackgroundTasks):
    os.makedirs(TERRAFORM_WORKDIR, exist_ok=True)
    if req.variables:
        with open(os.path.join(TERRAFORM_WORKDIR, "terraform.tfvars.json"), "w") as f:
            json.dump(req.variables, f)

    def _apply():
        try:
            subprocess.run([TERRAFORM_BIN, "init", "-input=false"], cwd=TERRAFORM_WORKDIR, check=True)
            subprocess.run([TERRAFORM_BIN, "plan", "-out=tfplan"], cwd=TERRAFORM_WORKDIR, check=True)
            subprocess.run([TERRAFORM_BIN, "apply", "-auto-approve", "tfplan"],
                           cwd=TERRAFORM_WORKDIR, check=True)
            slack(f"✅ Terraform provisioning complete for *{req.env_name}*")
        except subprocess.CalledProcessError as e:
            slack(f"❌ Terraform failed for *{req.env_name}* — {e}")
    bg.add_task(_apply)
    return {"ok": True, "message": f"Terraform apply started for {req.env_name}"}


# ---------- HEALTH ----------
@app.get("/health")
def health():
    return {"status": "ok", "time": int(time.time())}


# ---------- RUN ----------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
