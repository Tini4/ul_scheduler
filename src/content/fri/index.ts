import {
    add_entries_click_listener,
    add_undo_listener,
    get_enabled,
    get_save_schedule_response,
    load_saved_schedule,
    process_redirect,
    remove_elements
} from "../common.ts";

async function run() {
    if (!(await get_enabled()))
        return;

    await load_saved_schedule();

    const deleted: HTMLElement[] = [];

    add_entries_click_listener('div.grid-entry', deleted);
    add_undo_listener(deleted);

    // Remove the group list
    remove_elements('div.group-list');
    // Remove groups
    remove_elements('div.bottom-aligned');
    // Remove header links
    //remove_elements('div.header div.aside');

    // Rename subjects
    document.querySelectorAll<HTMLAnchorElement>('a.link-subject').forEach((entry) => {
        const m = entry.innerText.match(/^(.*?)(\(.*\))?_.*$/);

        if (m) {
            if (m[1]) {
                entry.innerText = m[1];
            } else if (m[2]) {
                entry.innerText = m[2];
            } else {
                entry.innerText = '_';
            }
        }
    });

    browser.runtime.onMessage.addListener(async (msg: unknown) => {
        if (typeof msg === 'object' && msg !== null && 'type' in msg) {
            if (msg.type === 'redirect') {
                process_redirect(msg);
                return;
            }

            if (msg.type === 'add_entry') {
                const typed_msg = msg as {
                    type: string;
                    payload: {
                        color: string;
                        day_ix: number;
                        start: number;
                        length: number;
                        title: string;
                        teacher: string;
                        classroom: string;
                        type_: string;
                    };
                };
                const {color, day_ix, start, length, title, teacher, classroom, type_} = typed_msg.payload;
                const day = ['MON', 'TUE', 'WED', 'THU', 'FRI'][day_ix];

                const div = document.querySelector<HTMLDivElement>(`div[style="grid-area: day${day}"]`)
                if (div) {
                    const temp = document.createElement('div');
                    temp.innerHTML = `
                    <div class="grid-entry" style="grid-row: ${start - 6} / span ${length}; background-color: ${color + 'b3'}">
                        <div class="description">
                            <div class="top-aligned">
                                <div class="row">
                                    <a class="link-subject" href="">${title}</a>
                                    <span class="entry-type">${type_ ? '| ' + type_ : ''}</span>
                                    <div class="entry-hover"></div>
                                </div>
                                <div class="row"><a class="link-classroom" href="">${classroom}</a></div>
                                <div class="row"><a class="link-teacher" href="">${teacher}</a></div>
                            </div>
                        </div>
                    </div>`;
                    const entry = temp.firstElementChild as HTMLDivElement;

                    entry.addEventListener('click', (event) => {
                        const div = event.currentTarget as HTMLDivElement;

                        deleted.push(div);
                        div.style.display = 'none';
                    });

                    div.prepend(entry);
                }

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
