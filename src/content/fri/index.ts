const deleted: HTMLDivElement[] = [];

// Listen for clicks on entries
document.querySelectorAll<HTMLDivElement>('div.grid-entry').forEach((entry) => {
    entry.addEventListener('click', (event: Event) => {
        const div = event.currentTarget as HTMLDivElement;

        deleted.push(div);
        div.style.display = 'none';
    });
});

// Listen for Ctrl+Z (Undo)
document.addEventListener('keydown', (event: KeyboardEvent) => {
    if (event.ctrlKey && event.key === 'z') {
        event.preventDefault();

        const div = deleted.pop();

        if (div) {
            div.style.display = '';
        }
    }
});
