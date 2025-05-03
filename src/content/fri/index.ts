async function run() {
    const res = await browser.storage.local.get('enabled');

    if (res.enabled !== true) return;

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
        const m = entry.innerText.match(/^(.*?)(?:\(.*\))?_.*$/);

        if (m) {
            entry.innerText = m[1];
        }
    });
}

run().then(() => {
});

browser.runtime.onMessage.addListener((msg: unknown) => {
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
                    day: string;
                    start: number;
                    length: number;
                    title: string;
                };
            };
            const {color, day, start, length, title} = typed_msg.payload;

            const div = document.querySelector<HTMLDivElement>(`div[style="grid-area: day${day}"]`)
            if (div) {
                const entry = `
                <div class="grid-entry" style="grid-row: ${start-6} / span ${length}; background-color: ${color+'7f'}">
                    <div class="description">
                        <div class="top-aligned">
                            <div class="row">
                                <a class="link-subject" href="">${title}</a>
                                <span class="entry-type"></span>
                                <div class="entry-hover"></div>
                            </div>
                            <div class="row"><a class="link-classroom" href=""></a></div>
                            <div class="row"><a class="link-teacher" href=""></a></div>
                        </div>
                    </div>
                </div>`;

                div.insertAdjacentHTML('afterbegin', entry);
            }
        }
    }
});
