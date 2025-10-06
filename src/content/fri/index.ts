async function run() {
    const res = await browser.storage.local.get('enabled');
    const enabled = (res.enabled as boolean) ?? true;

    if (!enabled) return;

    const deleted: HTMLDivElement[] = [];

    // Listen for clicks on entries
    document.querySelectorAll<HTMLDivElement>('div.grid-entry').forEach((entry) => {
        entry.addEventListener('click', (event) => {
            const div = event.currentTarget as HTMLDivElement;

            deleted.push(div);
            div.style.display = 'none';
        });
    });

    // Listen for Ctrl+Z (Undo)
    document.addEventListener('keydown', (event) => {
        if (event.ctrlKey && event.key === 'z') {
            event.preventDefault();

            const div = deleted.pop();

            if (div) {
                div.style.display = '';
            }
        }
    });

    // Remove the group list
    const gl = document.querySelector<HTMLDivElement>('div.group-list');
    if (gl) {
        gl.remove();
    }

    // Remove groups
    document.querySelectorAll<HTMLDivElement>('div.bottom-aligned').forEach((entry) => {
        entry.remove();
    });

    // Remove header links
    /*const hl = document.querySelector<HTMLDivElement>('div.header')?.querySelector<HTMLDivElement>('div.aside');
    if (hl) {
        hl.remove();
    }*/

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
            if (msg.type == 'redirect') {
                const typed_msg = msg as {
                    type: string;
                    payload: {
                        url: string;
                    };
                };
                const {url} = typed_msg.payload;

                window.location.href = url;
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
            }

            if (msg.type === 'save_schedule') {
                return {
                    success: true,
                    payload: {
                        html: document.body.innerHTML,
                    }
                }
            }

            if (msg.type === 'load_schedule') {
                const typed_msg = msg as {
                    type: string;
                    payload: {
                        html: string;
                    };
                };
                const {html} = typed_msg.payload;

                document.body.innerHTML = html;

                // Listen for clicks on entries
                document.querySelectorAll<HTMLDivElement>('div.grid-entry').forEach((entry) => {
                    entry.addEventListener('click', (event) => {
                        const div = event.currentTarget as HTMLDivElement;

                        deleted.push(div);
                        div.style.display = 'none';
                    });
                });
            }
        }
    });
}

run().then(() => {
});
