export async function get_enabled(): Promise<boolean> {
    const res = await browser.storage.local.get('enabled');
    return (res.enabled as boolean) ?? true;
}

export async function load_saved_schedule(): Promise<void> {
    const res = await browser.storage.local.get('schedules');
    const schedules = new Map(Object.entries(res.schedules ?? {}));

    const url = new URL(window.location.href);
    const name = url.searchParams.get('schedule');
    if (name !== null) {
        const html = schedules.get(name);
        if (html !== undefined) {
            document.body.innerHTML = html;
        }
    }
}

export function add_entries_click_listener(selector: string, deleted: HTMLElement[]): void {
    document.querySelectorAll<HTMLElement>(selector).forEach((entry) => {
        entry.addEventListener('click', (event) => {
            const entry = event.currentTarget as HTMLElement;

            deleted.push(entry);
            entry.style.display = 'none';
        });
    });
}

export function add_undo_listener(deleted: HTMLElement[]): void {
    // Listen for Ctrl+Z
    document.addEventListener('keydown', (event) => {
        if (event.ctrlKey && event.key === 'z') {
            event.preventDefault();

            const entry = deleted.pop();

            if (entry !== undefined) {
                entry.style.display = '';
            }
        }
    });
}

export function add_order_listener(): void {
    // Listen for Ctrl+O
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
}

export function remove_elements(selector: string): void {
    document.querySelectorAll<HTMLElement>(selector).forEach((entry) => {
        entry.remove();
    });
}

export function process_redirect(msg: object): void {
    const typed_msg = msg as {
        type: string,
        payload: {
            url: string,
        },
    };
    const {url} = typed_msg.payload;

    window.location.href = url;
}

export function get_save_schedule_response(): object {
    return {
        success: true,
        payload: {
            html: document.body.innerHTML,
        },
    };
}

export function process_add_entry_1(msg: object, height: number, deleted: HTMLElement[]): void {
    const typed_msg = msg as {
        type: string,
        payload: {
            color: string,
            day_ix: number,
            start: number,
            length: number,
            title: string,
            teacher: string,
            classroom: string,
            type_: string,
        },
    };
    const {color, day_ix, start, length, title, teacher, classroom, type_} = typed_msg.payload;
    const day = day_ix;

    const div = document.querySelector<HTMLDivElement>(`div#entries`);
    if (div) {
        const temp = document.createElement('div');
        temp.innerHTML = `
<div class="entry-absolute-box leftmost rightmost" style="left: ${day * 20}%; width: 20.00%; top: ${(start - 7) * (100 / height)}%; height: ${length * (100 / height)}%;">
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
</div>
        `;
        const entry = temp.firstElementChild as HTMLDivElement;

        entry.addEventListener('click', (event) => {
            const div = event.currentTarget as HTMLDivElement;

            deleted.push(div);
            div.style.display = 'none';
        });

        div.prepend(entry);
    }
}
