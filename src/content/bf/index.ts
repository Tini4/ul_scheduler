async function run() {
    const res = await browser.storage.local.get('enabled');
    const enabled = (res.enabled as boolean) ?? true;

    if (!enabled) return;

    const deleted: HTMLDivElement[] = [];

    // Listen for clicks on entries
    document.querySelectorAll<HTMLDivElement>('div.entry-absolute-box').forEach((entry) => {
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

    // Listen for Ctrl+O (Order)
    document.addEventListener('keydown', function (event) {
        if (event.ctrlKey && event.key === 'o') {
            event.preventDefault();

            document.querySelectorAll<HTMLDivElement>('div.entry-absolute-box').forEach(entry => {
                entry.classList.add('leftmost', 'rightmost');
                entry.style.left = Math.floor(parseFloat(entry.style.left) / 20) * 20 + '%';
                entry.style.width = '20%';
            });
        }
    });

    // Remove groups
    document.querySelectorAll<HTMLSpanElement>('span.layer_one').forEach((entry) => {
        entry.remove();
    });

    browser.runtime.onMessage.addListener((msg: unknown) => {
        if (typeof msg === 'object' && msg !== null && 'type' in msg) {
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
                const day = day_ix;

                const div = document.querySelector<HTMLDivElement>(`div#entries`)
                if (div) {
                    const temp = document.createElement('div');
                    temp.innerHTML = `
                    <div class="entry-absolute-box leftmost rightmost" style="left: ${day * 20}%; width: 20.00%; top: ${(start - 7) * 7.145}%; height: ${length * 7.145}%;">
                        <div class="entry" style="background-color: ${color + '7f'}">
                        <div class="main-box">
                            <span class="subject">
                                <a href="">${title}</a>
                                <span class="entry-type">${type_}</span>
                            </span>
                            <br>
                        </div>
                        <div class="teacher">
                            <a href="">${teacher}</a>
                        </div>
                        <div class="classroom">
                            <a href="">${classroom}</a>
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
        }
    });
}

run().then(() => {
});
