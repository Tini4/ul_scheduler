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

    // Remove group list
    const gl = document.querySelector<HTMLDivElement>('div.group-list');

    if (gl) {
        gl.remove();
    }

    // Remove groups
    document.querySelectorAll<HTMLDivElement>('div.bottom-aligned').forEach((entry) => {
        entry.remove();
    });

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
