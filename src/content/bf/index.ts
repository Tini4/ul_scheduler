import {
    add_entries_click_listener,
    add_order_listener,
    add_undo_listener,
    get_enabled,
    get_save_schedule_response,
    load_saved_schedule,
    process_add_entry_1,
    process_redirect,
    remove_elements
} from "../common.ts";

async function run() {
    if (!(await get_enabled()))
        return;

    await load_saved_schedule();

    const deleted: HTMLElement[] = [];

    add_entries_click_listener('div.entry-absolute-box', deleted);
    add_undo_listener(deleted);
    add_order_listener();

    // Remove groups
    remove_elements('span.layer_one');

    browser.runtime.onMessage.addListener(async (msg: unknown) => {
        if (typeof msg === 'object' && msg !== null && 'type' in msg) {
            if (msg.type === 'redirect') {
                process_redirect(msg);
                return;
            }

            if (msg.type === 'add_entry') {
                process_add_entry_1(msg, 14, deleted);
                return;
            }

            if (msg.type === 'save_schedule') {
                return get_save_schedule_response();
            }
        }
    });
}

run().then(() => {
});
