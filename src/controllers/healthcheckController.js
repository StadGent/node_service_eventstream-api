import Utils from '../lib/utils';

let db = null;

export async function statusAmIUp(req, res) {
    try {
        res.setHeader("Content-Type", "application/text");
        res.send("OK");
        res.end();
        Utils.log("GET /status/am-i-up", "controllers/healthcheckController.js:statusAmIUp", "INFO", req.correlationId())
    } catch (e) {
        Utils.sendNotFound(req, res);
    }
}

export async function statusDb(req, res) {
    try {
        if(!db) db = await Utils.initDb();

        res.setHeader("Content-Type", "application/json");
        let status;
        try {
            await db.authenticate();
            Utils.log('Connection has been established successfully.', "controllers/healthcheckController.js:statusDb", "INFO", req.correlationId());
            status = ["OK"];
        } catch (error) {
            Utils.log(`Unable to connect to the database: ${error}`, "controllers/healthcheckController.js:statusDb", "CRIT", req.correlationId());
            status = [
                "CRIT",
                {
                    "description": "database check failed",
                    "result": "CRIT",
                    "details": "Failed to connect"
                }
            ]
        }
        res.send(status);
        res.end();
    } catch (e) {
        Utils.log(`Probably unable to connect to the database: ${e}`, "controllers/healthcheckController.js:statusDb", "CRIT", req.correlationId());
        Utils.sendNotFound(req, res);
    }
}
