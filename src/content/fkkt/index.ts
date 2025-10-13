import {get_enabled} from "../common.ts";

async function run() {
    if (!(await get_enabled()))
        return;
}

run().then(() => {
});
