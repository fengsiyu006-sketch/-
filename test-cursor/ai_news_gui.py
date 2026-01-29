import html
import re
import threading
import urllib.parse
import urllib.request
import webbrowser
import xml.etree.ElementTree as ET
import tkinter as tk
from tkinter import messagebox, ttk


DEFAULT_KEYWORDS = ["AI", "人工智能", "AIGC", "大模型"]
BASE_RSS = "https://news.google.com/rss/search?q={query}&hl=zh-CN&gl=CN&ceid=CN:zh-Hans"


def strip_html(text: str) -> str:
    if not text:
        return ""
    text = html.unescape(text)
    text = re.sub(r"<[^>]+>", "", text)
    return text.strip()


def build_rss_url(keyword: str) -> str:
    return BASE_RSS.format(query=urllib.parse.quote(keyword))


def parse_rss(xml_bytes: bytes) -> list[dict]:
    root = ET.fromstring(xml_bytes)
    items = []

    # RSS 2.0
    channel = root.find("channel")
    if channel is not None:
        source_title = (channel.findtext("title") or "").strip()
        for item in channel.findall("item"):
            title = (item.findtext("title") or "").strip()
            link = (item.findtext("link") or "").strip()
            pub_date = (item.findtext("pubDate") or "").strip()
            description = strip_html(item.findtext("description") or "")
            source = (item.findtext("source") or source_title).strip()
            if title and link:
                items.append(
                    {
                        "title": title,
                        "link": link,
                        "time": pub_date,
                        "source": source,
                        "summary": description,
                    }
                )
        return items

    # Atom
    namespace = {"atom": "http://www.w3.org/2005/Atom"}
    for entry in root.findall("atom:entry", namespace):
        title = (entry.findtext("atom:title", default="", namespaces=namespace)).strip()
        link = ""
        for link_el in entry.findall("atom:link", namespace):
            if link_el.attrib.get("rel") in (None, "", "alternate"):
                link = link_el.attrib.get("href", "").strip()
                if link:
                    break
        pub_date = (
            entry.findtext("atom:updated", default="", namespaces=namespace).strip()
            or entry.findtext("atom:published", default="", namespaces=namespace).strip()
        )
        summary = strip_html(
            entry.findtext("atom:summary", default="", namespaces=namespace)
        )
        source = ""
        source_el = entry.find("atom:source", namespace)
        if source_el is not None:
            source = (
                source_el.findtext("atom:title", default="", namespaces=namespace)
            ).strip()
        if title and link:
            items.append(
                {
                    "title": title,
                    "link": link,
                    "time": pub_date,
                    "source": source,
                    "summary": summary,
                }
            )
    return items


def fetch_news(keywords: list[str]) -> list[dict]:
    all_items = []
    for keyword in keywords:
        try:
            url = build_rss_url(keyword)
            with urllib.request.urlopen(url, timeout=15) as resp:
                data = resp.read()
            all_items.extend(parse_rss(data))
        except Exception:
            continue

    seen = set()
    unique_items = []
    for item in all_items:
        key = item["link"] or item["title"]
        if key in seen:
            continue
        seen.add(key)
        unique_items.append(item)

    return unique_items


class AINewsApp(tk.Tk):
    def __init__(self) -> None:
        super().__init__()
        self.title("全网AI相关新闻知识获取")
        self.geometry("980x640")
        self.minsize(860, 520)
        self.center_window()

        self.items: list[dict] = []

        self.create_widgets()
        self.bind("<Return>", lambda _e: self.on_fetch())

    def center_window(self) -> None:
        self.update_idletasks()
        width = self.winfo_width()
        height = self.winfo_height()
        x = (self.winfo_screenwidth() // 2) - (width // 2)
        y = (self.winfo_screenheight() // 2) - (height // 2)
        self.geometry(f"{width}x{height}+{x}+{y}")

    def create_widgets(self) -> None:
        top_frame = ttk.Frame(self)
        top_frame.pack(side=tk.TOP, fill=tk.X, padx=12, pady=10)

        ttk.Label(top_frame, text="关键词：").pack(side=tk.LEFT)
        self.keyword_var = tk.StringVar()
        self.keyword_entry = ttk.Entry(
            top_frame, textvariable=self.keyword_var, width=40
        )
        self.keyword_entry.pack(side=tk.LEFT, padx=(0, 8))
        self.keyword_entry.insert(0, "AI, 人工智能, AIGC, 大模型")

        self.fetch_btn = ttk.Button(top_frame, text="获取最新", command=self.on_fetch)
        self.fetch_btn.pack(side=tk.LEFT)

        self.open_btn = ttk.Button(top_frame, text="打开原文", command=self.on_open)
        self.open_btn.pack(side=tk.LEFT, padx=(8, 0))

        main_frame = ttk.Frame(self)
        main_frame.pack(fill=tk.BOTH, expand=True, padx=12, pady=(0, 12))

        left_frame = ttk.Frame(main_frame)
        left_frame.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)

        columns = ("title", "source", "time")
        self.tree = ttk.Treeview(
            left_frame, columns=columns, show="headings", selectmode="browse"
        )
        self.tree.heading("title", text="标题")
        self.tree.heading("source", text="来源")
        self.tree.heading("time", text="时间")
        self.tree.column("title", width=520, anchor=tk.W)
        self.tree.column("source", width=140, anchor=tk.W)
        self.tree.column("time", width=180, anchor=tk.W)

        yscroll = ttk.Scrollbar(left_frame, orient=tk.VERTICAL, command=self.tree.yview)
        self.tree.configure(yscrollcommand=yscroll.set)
        self.tree.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        yscroll.pack(side=tk.RIGHT, fill=tk.Y)

        right_frame = ttk.Frame(main_frame, width=320)
        right_frame.pack(side=tk.RIGHT, fill=tk.BOTH, expand=False, padx=(10, 0))

        ttk.Label(right_frame, text="摘要 / 知识点").pack(anchor=tk.W)
        self.summary_text = tk.Text(
            right_frame, height=18, wrap=tk.WORD, font=("Segoe UI", 10)
        )
        self.summary_text.pack(fill=tk.BOTH, expand=True)

        self.status_var = tk.StringVar(value="就绪")
        status = ttk.Label(self, textvariable=self.status_var, anchor=tk.W)
        status.pack(side=tk.BOTTOM, fill=tk.X, padx=12, pady=(0, 8))

        self.tree.bind("<<TreeviewSelect>>", lambda _e: self.on_select())

    def set_status(self, text: str) -> None:
        self.status_var.set(text)
        self.update_idletasks()

    def on_fetch(self) -> None:
        keywords = self.keyword_var.get().strip()
        if keywords:
            parts = [p.strip() for p in keywords.split(",") if p.strip()]
        else:
            parts = DEFAULT_KEYWORDS

        self.fetch_btn.config(state=tk.DISABLED)
        self.set_status("正在获取资讯，请稍候...")

        def run() -> None:
            items = fetch_news(parts)
            self.after(0, lambda: self.show_results(items))

        threading.Thread(target=run, daemon=True).start()

    def show_results(self, items: list[dict]) -> None:
        self.items = items
        for row in self.tree.get_children():
            self.tree.delete(row)
        for idx, item in enumerate(items):
            self.tree.insert(
                "", tk.END, iid=str(idx), values=(item["title"], item["source"], item["time"])
            )
        self.fetch_btn.config(state=tk.NORMAL)
        self.set_status(f"已获取 {len(items)} 条资讯")
        if items:
            self.tree.selection_set("0")
            self.on_select()

    def on_select(self) -> None:
        selection = self.tree.selection()
        if not selection:
            return
        idx = int(selection[0])
        item = self.items[idx]
        self.summary_text.delete("1.0", tk.END)
        summary = item.get("summary") or "（无摘要，点击“打开原文”查看详细内容）"
        self.summary_text.insert(tk.END, summary)

    def on_open(self) -> None:
        selection = self.tree.selection()
        if not selection:
            messagebox.showinfo("提示", "请先选择一条资讯。")
            return
        idx = int(selection[0])
        link = self.items[idx]["link"]
        webbrowser.open(link)


if __name__ == "__main__":
    app = AINewsApp()
    app.mainloop()
