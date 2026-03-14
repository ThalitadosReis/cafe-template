import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowCounterClockwiseIcon,
  PlusIcon,
  TrashIcon,
  WarningIcon,
  XIcon,
  DotsSixVerticalIcon,
  SignOutIcon,
  EyeIcon,
} from "@phosphor-icons/react";
import { getMenu, saveMenu, resetMenu } from "../data/menu.js";
import { useLang } from "../i18n/LangContext.jsx";
import MenuPage from "./Menu.jsx";

const ADMIN_AUTH_KEY = "boldbrew_admin_authed";
const DESKTOP_ITEM_GRID_CLASS =
  "grid grid-cols-[28px_16px_minmax(0,1fr)_minmax(0,1fr)_88px_28px] items-center gap-x-3";
const NAV_BUTTON_CLASS =
  "flex items-center gap-1.5 rounded-full border border-taupe-300 px-4 py-2 text-xs uppercase tracking-wider text-taupe-600 transition-colors hover:border-taupe-500 hover:text-taupe-900";
const NAV_ICON_BUTTON_CLASS =
  "flex h-9 w-9 items-center justify-center rounded-full border border-taupe-300 text-taupe-500 transition-colors hover:border-taupe-500 hover:text-taupe-900";
const LANG_BUTTON_CLASS =
  "rounded-full border border-dashed border-taupe-400 px-4 py-2 text-xs uppercase tracking-wider text-taupe-600 transition-colors hover:border-taupe-700 hover:text-taupe-900";
const SECTION_CARD_CLASS = "rounded-xl border border-taupe-300 bg-taupe-50";

function EditableCell({
  value,
  onChange,
  mono,
  placeholder,
  className = "",
  dim = false,
  text,
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  const commit = () => {
    setEditing(false);
    if (draft !== value) onChange(draft);
  };

  if (editing) {
    return (
      <input
        autoFocus
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") commit();
          if (e.key === "Escape") {
            setDraft(value);
            setEditing(false);
          }
        }}
        className={`w-full rounded-sm border border-taupe-500 bg-white px-2 py-0.5 outline-none ${mono ? "font-mono text-xs text-taupe-700" : "text-sm text-taupe-900"} ${className}`}
      />
    );
  }

  return (
    <span
      onClick={() => setEditing(true)}
      title={text.editable.clickToEdit}
      className={`block cursor-text truncate rounded-sm px-1 -mx-1 transition-colors hover:bg-taupe-100/70 ${mono ? "font-mono text-xs font-semibold text-taupe-700" : "text-sm"} ${dim ? "text-taupe-600" : "text-taupe-900"} ${!value ? "italic text-taupe-400" : ""} ${className}`}
    >
      {value || placeholder || text.editable.empty}
    </span>
  );
}

function ColumnHeaders({ text }) {
  return (
    <div
      className={`${DESKTOP_ITEM_GRID_CLASS} hidden border-b border-taupe-300 bg-taupe-100 px-4 py-2 md:grid`}
    >
      <span />
      <span />
      <span className="flex items-center gap-1 text-[9px] font-medium uppercase tracking-[0.2em] text-taupe-600">
        <span className="inline-block h-2 w-2 rounded-full bg-[#4a90d9]/40" />{" "}
        EN
      </span>
      <span className="flex items-center gap-1 text-[9px] font-medium uppercase tracking-[0.2em] text-taupe-600">
        <span className="inline-block h-2 w-2 rounded-full bg-[#e07b4a]/40" />{" "}
        DE
      </span>
      <span className="text-right text-[9px] font-medium uppercase tracking-[0.2em] text-taupe-600">
        {text.headers.price}
      </span>
      <span />
    </div>
  );
}

function SortableItemRow({ item, catId, onUpdate, onRemove, isLast, text }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.35 : 1,
    zIndex: isDragging ? 50 : "auto",
    position: "relative",
  };

  const updateLangField = (field, lang, val) =>
    onUpdate(catId, item.id, field, { ...item[field], [lang]: val });
  const updatePrice = (val) =>
    onUpdate(catId, item.id, "price", val.replace(/[^0-9.]/g, ""));

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group border-b border-taupe-300 bg-taupe-50 ${isDragging ? "rounded-sm border border-taupe-400 shadow-xl" : ""} ${isLast ? "border-b-0" : ""}`}
    >
      <div className="px-4 py-3 md:hidden">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              {...listeners}
              {...attributes}
              className="cursor-grab touch-none text-taupe-400 hover:text-taupe-600 active:cursor-grabbing"
              aria-label={text.editable.dragToReorder}
            >
              <DotsSixVerticalIcon size={18} weight="bold" />
            </button>
          </div>

          <button
            onClick={() => onRemove(catId, item.id)}
            className="rounded-full p-1 text-taupe-400 transition-colors hover:bg-taupe-100 hover:text-red-400"
            aria-label={text.editable.removeItem}
          >
            <TrashIcon size={16} />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <p className="mb-1 text-[10px] uppercase tracking-[0.2em] text-taupe-500">
              EN
            </p>
            <EditableCell
              value={item.name?.en ?? ""}
              onChange={(val) => updateLangField("name", "en", val)}
              placeholder={text.headers.nameEn}
              text={text}
            />
            <EditableCell
              value={item.desc?.en ?? ""}
              onChange={(val) => updateLangField("desc", "en", val)}
              placeholder={text.headers.descEn}
              dim
              className="mt-1"
              text={text}
            />
          </div>

          <div>
            <p className="mb-1 text-[10px] uppercase tracking-[0.2em] text-taupe-500">
              DE
            </p>
            <EditableCell
              value={item.name?.de ?? ""}
              onChange={(val) => updateLangField("name", "de", val)}
              placeholder={text.headers.nameDe}
              text={text}
            />
            <EditableCell
              value={item.desc?.de ?? ""}
              onChange={(val) => updateLangField("desc", "de", val)}
              placeholder={text.headers.descDe}
              dim
              className="mt-1"
              text={text}
            />
          </div>

          <div>
            <p className="mb-1 text-[10px] uppercase tracking-[0.2em] text-taupe-500">
              {text.headers.price}
            </p>
            <EditableCell
              value={`CHF ${item.price}`}
              onChange={updatePrice}
              mono
              placeholder="0.00"
              text={text}
            />
          </div>
        </div>
      </div>

      <div className="hidden md:block">
        <div className={`${DESKTOP_ITEM_GRID_CLASS} px-4 pb-1 pt-3`}>
          <button
            {...listeners}
            {...attributes}
            className="cursor-grab touch-none text-taupe-400 hover:text-taupe-600 active:cursor-grabbing"
            aria-label={text.editable.dragToReorder}
          >
            <DotsSixVerticalIcon size={16} weight="bold" />
          </button>

          <div className="flex flex-col gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              onClick={() => onUpdate(catId, item.id, "__moveUp")}
              className="text-taupe-500 transition-colors hover:text-taupe-700"
              aria-label={text.editable.moveUp}
            >
              <ArrowUpIcon size={10} weight="bold" />
            </button>
            <button
              onClick={() => onUpdate(catId, item.id, "__moveDown")}
              className="text-taupe-500 transition-colors hover:text-taupe-700"
              aria-label={text.editable.moveDown}
            >
              <ArrowDownIcon size={10} weight="bold" />
            </button>
          </div>

          <EditableCell
            value={item.name?.en ?? ""}
            onChange={(val) => updateLangField("name", "en", val)}
            placeholder={text.headers.nameEn}
            text={text}
          />
          <EditableCell
            value={item.name?.de ?? ""}
            onChange={(val) => updateLangField("name", "de", val)}
            placeholder={text.headers.nameDe}
            text={text}
          />
          <div className="text-right">
            <EditableCell
              value={`CHF ${item.price}`}
              onChange={updatePrice}
              mono
              placeholder="0.00"
              text={text}
            />
          </div>

          <button
            onClick={() => onRemove(catId, item.id)}
            className="opacity-0 text-taupe-400 transition-colors hover:text-red-400 group-hover:opacity-100"
            aria-label={text.editable.removeItem}
          >
            <TrashIcon size={14} />
          </button>
        </div>

        <div className={`${DESKTOP_ITEM_GRID_CLASS} px-4 pb-3`}>
          <span />
          <span />
          <EditableCell
            value={item.desc?.en ?? ""}
            onChange={(val) => updateLangField("desc", "en", val)}
            placeholder={text.headers.descEn}
            dim
            text={text}
          />
          <EditableCell
            value={item.desc?.de ?? ""}
            onChange={(val) => updateLangField("desc", "de", val)}
            placeholder={text.headers.descDe}
            dim
            text={text}
          />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
}

function AdminActionButton({ children, className = "", ...props }) {
  return (
    <button className={`${NAV_BUTTON_CLASS} ${className}`} {...props}>
      {children}
    </button>
  );
}

function PreviewButton({ onClick, label, compact = false }) {
  return (
    <AdminActionButton onClick={onClick}>
      <EyeIcon size={13} />
      {!compact && <span>{label}</span>}
    </AdminActionButton>
  );
}

function ResetButton({ onClick, label, compact = false }) {
  return (
    <AdminActionButton onClick={onClick}>
      <ArrowCounterClockwiseIcon size={13} />
      {!compact && <span>{label}</span>}
    </AdminActionButton>
  );
}

function LogoutButton({ onClick, label, compact = false }) {
  return (
    <AdminActionButton onClick={onClick}>
      <SignOutIcon size={13} />
      {!compact && <span>{label}</span>}
    </AdminActionButton>
  );
}

function LanguageToggleButton({ lang, onClick }) {
  return (
    <button onClick={onClick} className={LANG_BUTTON_CLASS}>
      {lang === "en" ? "DE" : "EN"}
    </button>
  );
}

function AdminPreviewModal({ open, title, closeLabel, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-taupe-900/50 p-0 backdrop-blur-sm sm:p-4">
      <div className="h-screen w-full overflow-hidden border border-taupe-300 bg-taupe-50 shadow-2xl sm:h-[90vh] sm:max-w-7xl sm:rounded-2xl">
        <div className="flex h-14 items-center justify-between border-b border-taupe-300 px-4">
          <p className="font-ui text-xs uppercase tracking-[0.2em] text-taupe-600">
            {title}
          </p>
          <button
            onClick={onClose}
            className="text-taupe-600 transition-colors hover:text-taupe-900"
            aria-label={closeLabel}
          >
            <XIcon size={18} />
          </button>
        </div>
        <div className="h-[calc(100%-56px)] overflow-y-auto">
          <MenuPage />
        </div>
      </div>
    </div>
  );
}

function CategoryBlock({
  category,
  catIdx,
  onUpdateItem,
  onRemoveItem,
  onDragEnd,
  onUpdateLabel,
  text,
}) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  const itemIds = category.items.map((i) => i.id);

  return (
    <div className="mb-5 overflow-hidden rounded-xl border border-taupe-300">
      <div className="flex flex-wrap items-center gap-3 border-b border-taupe-300 bg-taupe-100 px-4 py-3.5">
        <span className="w-5 shrink-0 text-[11px] font-medium tabular-nums text-taupe-600">
          {String(catIdx + 1).padStart(2, "0")}
        </span>

        <div className="min-w-0 flex-1 grid grid-cols-2 gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4a90d9]/50 shrink-0" />
            <EditableCell
              value={category.label?.en ?? ""}
              onChange={(val) => onUpdateLabel(category.id, "en", val)}
              className="font-display text-lg font-light sm:text-xl"
              placeholder={text.headers.categoryEn}
              text={text}
            />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#e07b4a]/50 shrink-0" />
            <EditableCell
              value={category.label?.de ?? ""}
              onChange={(val) => onUpdateLabel(category.id, "de", val)}
              className="font-display text-lg font-light sm:text-xl"
              placeholder={text.headers.categoryDe}
              text={text}
            />
          </div>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <span className="shrink-0 text-[11px] text-taupe-500">
            {category.items.length} {text.headers.itemCount}
          </span>
        </div>
      </div>

      <ColumnHeaders text={text} />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={(event) => onDragEnd(category.id, event)}
      >
        <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
          {category.items.map((item, i) => (
            <SortableItemRow
              key={item.id}
              item={item}
              catId={category.id}
              onUpdate={onUpdateItem}
              onRemove={onRemoveItem}
              isLast={i === category.items.length - 1}
              text={text}
            />
          ))}
        </SortableContext>
      </DndContext>

      <button
        onClick={() => onUpdateItem(category.id, null, "__addItem")}
        className="flex w-full items-center justify-center gap-2 border-t border-dashed border-taupe-300 bg-taupe-50 py-3 text-[11px] uppercase tracking-widest text-taupe-500 transition-colors hover:bg-taupe-100 hover:text-taupe-700"
      >
        <PlusIcon size={12} /> {text.headers.addItem}
      </button>
    </div>
  );
}

function LoginScreen({ onLogin, text }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (pw === "boldbrew2024") onLogin();
    else {
      setErr(true);
      setPw("");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-taupe-100 px-6">
      <div className="w-full max-w-sm">
        <div>
          <p className="text-sm font-medium leading-none text-taupe-900">
            {text.login.brand}
          </p>
          <p className="text-[10px] uppercase tracking-widest text-taupe-600">
            {text.login.admin}
          </p>
        </div>
        <h1 className="mb-2 font-display text-4xl font-light text-taupe-900">
          {text.login.title}
        </h1>
        <p className="mb-8 text-sm text-taupe-600">{text.login.subtitle}</p>
        <form onSubmit={submit} className="space-y-4">
          <input
            type="password"
            value={pw}
            onChange={(e) => {
              setPw(e.target.value);
              setErr(false);
            }}
            placeholder={text.login.passwordPlaceholder}
            autoFocus
            className={`w-full rounded-sm border bg-white px-4 py-3 text-sm text-taupe-900 outline-none transition-colors ${err ? "border-red-400" : "border-taupe-300 focus:border-taupe-600"}`}
          />
          {err && (
            <p className="text-xs text-red-500 flex items-center gap-1">
              <WarningIcon size={12} /> {text.login.wrongPassword}
            </p>
          )}
          <button
            type="submit"
            className="w-full rounded-full bg-taupe-900 py-3 text-sm uppercase tracking-wider text-taupe-100 transition-colors hover:bg-taupe-600"
          >
            {text.login.login}
          </button>
        </form>
        <p className="mt-4 text-center text-xs text-taupe-500">
          {text.login.demoPassword}
        </p>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const navigate = useNavigate();
  const { t, lang, setLang } = useLang();
  const copy = t.admin;

  const [authed, setAuthed] = useState(
    () => localStorage.getItem(ADMIN_AUTH_KEY) === "true",
  );
  const [menu, setMenu] = useState([]);
  const [saveStatus, setSaveStatus] = useState("idle");
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    if (authed) setMenu(getMenu());
  }, [authed]);

  useEffect(() => {
    if (!authed || menu.length === 0) return;
    saveMenu(menu);
    window.dispatchEvent(new Event("boldbrew:menuUpdated"));
    setSaveStatus("saved");
    const timeout = setTimeout(() => setSaveStatus("idle"), 1800);
    return () => clearTimeout(timeout);
  }, [menu, authed]);

  useEffect(() => {
    localStorage.setItem(ADMIN_AUTH_KEY, authed ? "true" : "false");
  }, [authed]);

  if (!authed)
    return <LoginScreen onLogin={() => setAuthed(true)} text={copy} />;

  const totalItems = menu.reduce((acc, cat) => acc + cat.items.length, 0);

  const handleUpdateLabel = (catId, lang, val) => {
    setMenu((prev) =>
      prev.map((cat) =>
        cat.id !== catId
          ? cat
          : { ...cat, label: { ...cat.label, [lang]: val } },
      ),
    );
  };

  const handleUpdateItem = (catId, itemId, field, value) => {
    setMenu((prev) =>
      prev.map((cat) => {
        if (cat.id !== catId) return cat;
        let items = [...cat.items];

        if (field === "__addItem") {
          return {
            ...cat,
            items: [
              ...items,
              {
                id: `i_new_${Date.now()}`,
                name: { en: "", de: "" },
                desc: { en: "", de: "" },
                price: "0.00",
              },
            ],
          };
        }
        if (field === "__moveUp") {
          const idx = items.findIndex((i) => i.id === itemId);
          if (idx > 0) items = arrayMove(items, idx, idx - 1);
          return { ...cat, items };
        }
        if (field === "__moveDown") {
          const idx = items.findIndex((i) => i.id === itemId);
          if (idx < items.length - 1) items = arrayMove(items, idx, idx + 1);
          return { ...cat, items };
        }

        return {
          ...cat,
          items: items.map((item) =>
            item.id !== itemId ? item : { ...item, [field]: value },
          ),
        };
      }),
    );
  };

  const handleRemoveItem = (catId, itemId) => {
    setMenu((prev) =>
      prev.map((cat) =>
        cat.id !== catId
          ? cat
          : { ...cat, items: cat.items.filter((i) => i.id !== itemId) },
      ),
    );
  };

  const handleDragEnd = (catId, event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setMenu((prev) =>
      prev.map((cat) => {
        if (cat.id !== catId) return cat;
        const oldIdx = cat.items.findIndex((i) => i.id === active.id);
        const newIdx = cat.items.findIndex((i) => i.id === over.id);
        return { ...cat, items: arrayMove(cat.items, oldIdx, newIdx) };
      }),
    );
  };

  const handleAddCategory = () => {
    setMenu((prev) => [
      ...prev,
      {
        id: `cat_new_${Date.now()}`,
        label: {
          en: copy.headers.newCategoryEn,
          de: copy.headers.newCategoryDe,
        },
        items: [],
      },
    ]);
  };

  const handleReset = () => {
    if (!confirm(copy.headers.resetConfirm)) return;
    setMenu(resetMenu());
  };

  const handleLogout = () => {
    localStorage.removeItem(ADMIN_AUTH_KEY);
    setAuthed(false);
  };

  const handleLangToggle = () => {
    setLang(lang === "en" ? "de" : "en");
  };

  const statCards = [
    { label: copy.page.stats.categories, value: menu.length },
    { label: copy.page.stats.items, value: totalItems },
  ];

  return (
    <div className="min-h-screen bg-taupe-100">
      <header className="sticky top-0 z-40 border-b border-taupe-300 bg-taupe-50/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:px-6 lg:px-12">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex min-w-0 items-center gap-3">
                <button
                  onClick={() => navigate("/")}
                  className={NAV_ICON_BUTTON_CLASS}
                  aria-label={copy.topbar.backToSite}
                >
                  <svg
                    width="16"
                    height="16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M19 12H5M12 5l-7 7 7 7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                <div className="flex min-w-0 select-none flex-col leading-none">
                  <span className="truncate font-display text-lg font-light uppercase tracking-[0.15em] text-taupe-900 sm:text-xl">
                    {copy.topbar.brand}
                  </span>
                  <span className="font-ui text-[9px] font-light uppercase tracking-[0.35em] text-taupe-500">
                    {copy.topbar.admin}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <div className="sm:hidden">
                <LogoutButton onClick={handleLogout} compact />
              </div>

              <div className="hidden items-center gap-2 sm:flex sm:gap-3">
                <PreviewButton
                  onClick={() => setPreviewOpen(true)}
                  label={copy.topbar.preview}
                />
                <ResetButton onClick={handleReset} label={copy.topbar.reset} />
                <LogoutButton onClick={handleLogout} label={copy.topbar.logout} />
                <LanguageToggleButton lang={lang} onClick={handleLangToggle} />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 sm:hidden">
            <PreviewButton onClick={() => setPreviewOpen(true)} compact />
            <ResetButton onClick={handleReset} compact />
            <LanguageToggleButton lang={lang} onClick={handleLangToggle} />
          </div>
        </div>
      </header>

      <AdminPreviewModal
        open={previewOpen}
        title={copy.topbar.preview}
        closeLabel={copy.topbar.backToSite}
        onClose={() => setPreviewOpen(false)}
      />

      <div className="mx-auto max-w-7xl px-4 py-2 sm:px-6 sm:py-10 lg:px-12">
        <div className="mb-6 flex justify-end">
          <span
            className={`text-[11px] transition-all duration-500 ${saveStatus === "saved" ? "text-taupe-600" : "text-transparent"}`}
          >
            {copy.topbar.saved}
          </span>
        </div>

        <section className="mb-8">
          <p className="mb-2 text-[10px] uppercase tracking-[0.25em] text-taupe-600">
            {copy.page.kicker}
          </p>
          <h1 className="mb-2 font-display text-3xl font-light text-taupe-900 sm:text-4xl">
            {copy.page.title}
          </h1>
          <p className="text-sm text-taupe-600">{copy.page.description}</p>
        </section>

        <section className="mb-8 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {statCards.map(({ label, value }) => (
              <div key={label} className={`${SECTION_CARD_CLASS} p-4`}>
                <p className="mb-1 text-[10px] uppercase tracking-widest text-taupe-500">
                  {label}
                </p>
                <p className="font-display text-3xl font-light text-taupe-700">
                  {value}
                </p>
              </div>
            ))}
          </div>

          <div
            className={`${SECTION_CARD_CLASS} flex flex-wrap items-center gap-x-5 gap-y-2 px-4 py-3 text-xs text-taupe-600`}
          >
            <span className="text-taupe-700">ⓘ</span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#4a90d9]/40" />{" "}
              {copy.page.legend.english}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#e07b4a]/40" />{" "}
              {copy.page.legend.german}
            </span>
            <span className="mx-1 text-taupe-400">·</span>
            {copy.page.legend.text}
          </div>
        </section>

        <section className="rounded-2xl border border-taupe-300 bg-taupe-50 p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-3 border-b border-taupe-300 pb-3">
            <h2 className="font-ui text-[11px] uppercase tracking-[0.2em] text-taupe-600">
              {copy.page.title}
            </h2>
            <span className="text-[10px] uppercase tracking-[0.2em] text-taupe-500">
              {menu.length} {copy.page.stats.categories}
            </span>
          </div>

          {menu.map((category, catIdx) => (
            <CategoryBlock
              key={category.id}
              category={category}
              catIdx={catIdx}
              onUpdateItem={handleUpdateItem}
              onRemoveItem={handleRemoveItem}
              onDragEnd={handleDragEnd}
              onUpdateLabel={handleUpdateLabel}
              text={copy}
            />
          ))}

          <button
            onClick={handleAddCategory}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-dashed border-taupe-400 py-4 text-xs uppercase tracking-widest text-taupe-600 transition-colors hover:border-taupe-700 hover:text-taupe-700"
          >
            <PlusIcon size={13} /> {copy.headers.addCategory}
          </button>
        </section>
      </div>
    </div>
  );
}
