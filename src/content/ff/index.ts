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

    const save_loaded = await load_saved_schedule();

    // Use good layout unless loading a saved schedule
    const url = new URL(window.location.href);
    if (!save_loaded && url.searchParams.get('is_alternative') !== 'false') {
        url.searchParams.set('is_alternative', 'false');
        window.location.href = url.toString();
        return;
    }

    const deleted: HTMLElement[] = [];

    add_entries_click_listener('div.entry-absolute-box', deleted);
    add_undo_listener(deleted);
    add_order_listener();

    // Remove groups
    remove_elements('span.layer_one');

    // Remove Saturday
    if (document.querySelectorAll('#days .day').length === 6) {
        // Remove Saturday header and scale the remaining headers
        document.querySelectorAll<HTMLElement>('#days .day').forEach((day, index) => {
            if (index === 5) {
                day.remove();
                return;
            }

            const left = parseFloat(day.style.left);
            const width = parseFloat(day.style.getPropertyValue('--day-width'));

            // Scale the original 6-column layout to 5 columns
            day.style.left = `${left * 6 / 5}%`;
            day.style.setProperty('--day-width', `${width * 6 / 5}%`);
        });

        // Remove Saturday entries and scale the remaining entries
        document.querySelectorAll<HTMLDivElement>('div.entry-absolute-box').forEach(entry => {
            const left = parseFloat(entry.style.left);
            const width = parseFloat(entry.style.width);

            // Saturday starts at 83.33%
            if (left >= 83) {
                entry.remove();
                return;
            }

            // Scale the original 6-column layout to 5 columns
            entry.style.left = `${left * 6 / 5}%`;
            entry.style.width = `${width * 6 / 5}%`;
        });
    }

    browser.runtime.onMessage.addListener(async (msg: unknown) => {
        if (typeof msg === 'object' && msg !== null && 'type' in msg) {
            if (msg.type === 'redirect') {
                process_redirect(msg);
                return;
            }

            if (msg.type === 'add_entry') {
                process_add_entry_1(msg, 13, deleted);
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
