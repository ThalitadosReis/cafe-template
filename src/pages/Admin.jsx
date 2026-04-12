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
  WarningIcon,
  XIcon,
  DotsSixVerticalIcon,
  SignOutIcon,
  EyeIcon,
} from "@phosphor-icons/react";
import { getInitialMenu, getMenu, saveMenu, resetMenu } from "../data/menu.js";
import { useLang } from "../i18n/LangContext.jsx";
import MenuPage from "./Menu.jsx";

const ADMIN_AUTH_KEY = "boldbrew_admin_authed";
const DESKTOP_ITEM_GRID_CLASS =
  "grid grid-cols-[28px_16px_minmax(0,1fr)_88px_28px] items-start gap-x-3";
const NAV_BUTTON_CLASS =
  "flex items-center gap-1.5 border border-taupe-200 px-4 py-2 font-body text-xs uppercase tracking-wider text-taupe-600 transition-colors hover:border-taupe-400 hover:text-taupe-900";
const NAV_ICON_BUTTON_CLASS =
  "flex items-center justify-center text-taupe-500 transition-colors hover:text-taupe-900";
const SECTION_CARD_CLASS = "border border-taupe-300 bg-taupe-50";

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
        className={`w-full border border-taupe-500 bg-taupe-50 px-2 py-0.5 outline-none ${mono ? "font-body text-xs text-taupe-700" : "text-sm text-taupe-900"} ${className}`}
      />
    );
  }

  return (
    <span
      onClick={() => setEditing(true)}
      title={text.editable.clickToEdit}
      className={`block cursor-text truncate px-1 -mx-1 transition-colors hover:bg-taupe-100/70 ${mono ? "font-body text-xs font-semibold text-taupe-700" : "text-sm"} ${dim ? "text-taupe-600" : "text-taupe-900"} ${!value ? "italic text-taupe-400" : ""} ${className}`}
    >
      {value || placeholder || text.editable.empty}
    </span>
  );
}

function LangRow({ lang, item, updateLangField, text }) {
  const isEN = lang === "en";
  return (
    <div
      className={`flex items-start gap-2 rounded-sm px-2 py-1.5 ${
        isEN ? "bg-taupe-900/3" : "mt-1 bg-taupe-400/10"
      }`}
    >
      <span
        className={`mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full ${
          isEN ? "bg-taupe-900/40" : "bg-taupe-500/60"
        }`}
      />
      <div className="min-w-0 flex-1">
        <EditableCell
          value={item.name?.[lang] ?? ""}
          onChange={(val) => updateLangField("name", lang, val)}
          placeholder={isEN ? text.headers.nameEn : text.headers.nameDe}
          text={text}
        />
        <EditableCell
          value={item.desc?.[lang] ?? ""}
          onChange={(val) => updateLangField("desc", lang, val)}
          placeholder={isEN ? text.headers.descEn : text.headers.descDe}
          dim
          className="mt-0.5"
          text={text}
        />
      </div>
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
        <div className="mb-3 flex items-center justify-between">
          <button
            {...listeners}
            {...attributes}
            className="cursor-grab touch-none text-taupe-400 hover:text-taupe-600 active:cursor-grabbing"
            aria-label={text.editable.dragToReorder}
          >
            <DotsSixVerticalIcon size={18} weight="bold" />
          </button>
          <button
            onClick={() => onRemove(catId, item.id)}
            className="p-1 text-taupe-400 transition-colors hover:text-taupe-900"
            aria-label={text.editable.removeItem}
          >
            <XIcon size={16} />
          </button>
        </div>

        <LangRow
          lang="en"
          item={item}
          updateLangField={updateLangField}
          text={text}
        />
        <LangRow
          lang="de"
          item={item}
          updateLangField={updateLangField}
          text={text}
        />

        <div className="mt-3 border-t border-taupe-200 pt-3">
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

      <div className="hidden md:block">
        <div className={`${DESKTOP_ITEM_GRID_CLASS} px-4 py-3`}>
          <button
            {...listeners}
            {...attributes}
            className="mt-0.5 cursor-grab touch-none text-taupe-400 hover:text-taupe-600 active:cursor-grabbing"
            aria-label={text.editable.dragToReorder}
          >
            <DotsSixVerticalIcon size={16} weight="bold" />
          </button>

          <div className="mt-1 flex flex-col gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
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

          <div>
            <LangRow
              lang="en"
              item={item}
              updateLangField={updateLangField}
              text={text}
            />
            <LangRow
              lang="de"
              item={item}
              updateLangField={updateLangField}
              text={text}
            />
          </div>

          <div className="text-right">
            <p className="mb-0.5 text-[9px] uppercase tracking-[0.2em] text-taupe-500">
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

          <button
            onClick={() => onRemove(catId, item.id)}
            className="mt-0.5 opacity-0 text-taupe-400 transition-colors hover:text-taupe-900 group-hover:opacity-100"
            aria-label={text.editable.removeItem}
          >
            <XIcon size={14} />
          </button>
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

function AdminPreviewModal({ open, title, closeLabel, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-taupe-900/50 p-0 backdrop-blur-sm sm:p-4">
      <div className="h-screen w-full overflow-hidden border border-taupe-300 bg-taupe-50 shadow-2xl sm:h-[90vh] sm:max-w-7xl">
        <div className="flex h-14 items-center justify-between border-b border-taupe-300 px-4">
          <p className="font-body text-xs uppercase tracking-[0.2em] text-taupe-600">
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
  onRemoveCategory,
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
    <div className="mb-5 overflow-hidden border border-taupe-300">
      <div className="flex flex-wrap items-center gap-3 border-b border-taupe-300 bg-taupe-100 px-4 py-3.5">
        <span className="w-5 shrink-0 text-[11px] font-medium tabular-nums text-taupe-600">
          {String(catIdx + 1).padStart(2, "0")}
        </span>

        <div className="min-w-0 flex-1 grid grid-cols-2 gap-0">
          <div className="flex items-center gap-2 rounded-sm bg-taupe-900/4 px-2 py-1">
            <span className="shrink-0 font-body text-[8px] font-semibold uppercase tracking-[0.2em] text-taupe-900/50">
              EN
            </span>
            <EditableCell
              value={category.label?.en ?? ""}
              onChange={(val) => onUpdateLabel(category.id, "en", val)}
              className="font-display text-lg font-light sm:text-xl"
              placeholder={text.headers.categoryEn}
              text={text}
            />
          </div>
          <div className="flex items-center gap-2 rounded-sm bg-taupe-400/8 px-2 py-1 ml-1">
            <span className="shrink-0 font-body text-[8px] font-semibold uppercase tracking-[0.2em] text-taupe-500">
              DE
            </span>
            <EditableCell
              value={category.label?.de ?? ""}
              onChange={(val) => onUpdateLabel(category.id, "de", val)}
              className="font-display text-lg font-light sm:text-xl text-taupe-700"
              placeholder={text.headers.categoryDe}
              text={text}
            />
          </div>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <span className="shrink-0 text-[11px] text-taupe-500">
            {category.items.length} {text.headers.itemCount}
          </span>
          <button
            onClick={() => {
              if (confirm(text.headers.deleteCategoryConfirm))
                onRemoveCategory(category.id);
            }}
            className="text-taupe-400 transition-colors hover:text-taupe-900"
            aria-label={text.editable.deleteCategory}
          >
            <XIcon size={14} />
          </button>
        </div>
      </div>

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
    <div className="flex min-h-screen items-center justify-center bg-taupe-50 px-6">
      <div className="w-full max-w-sm">
        <div className="mb-10 flex flex-col leading-none">
          <span className="font-display text-xl font-light uppercase tracking-[0.15em] text-taupe-900">
            {text.login.brand}
          </span>
          <span className="font-body text-[9px] font-light uppercase tracking-[0.35em] text-taupe-500">
            {text.login.admin}
          </span>
        </div>
        <h1 className="mb-2 font-display text-4xl font-light italic text-taupe-900">
          {text.login.title}
        </h1>
        <p className="mb-8 font-body text-sm font-light text-taupe-600">
          {text.login.subtitle}
        </p>
        <form onSubmit={submit} className="space-y-4">
          <label htmlFor="admin-password" className="sr-only">
            {text.login.passwordPlaceholder}
          </label>
          <input
            id="admin-password"
            type="password"
            value={pw}
            onChange={(e) => {
              setPw(e.target.value);
              setErr(false);
            }}
            placeholder={text.login.passwordPlaceholder}
            autoFocus
            className={`w-full border bg-transparent px-4 py-3 font-body text-sm text-taupe-900 outline-none transition-colors ${err ? "border-taupe-700" : "border-taupe-300 focus:border-taupe-600"}`}
          />
          {err && (
            <p className="flex items-center gap-1 font-body text-xs text-taupe-900">
              <WarningIcon size={12} /> {text.login.wrongPassword}
            </p>
          )}
          <button
            type="submit"
            className="w-full bg-taupe-900 py-3 font-body text-[10px] uppercase tracking-[0.22em] text-taupe-100 transition-colors hover:bg-taupe-700"
          >
            {text.login.login}
          </button>
        </form>
        <p className="mt-6 font-body text-xs text-taupe-500">
          {text.login.demoPassword}
        </p>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const navigate = useNavigate();
  const { t } = useLang();
  const copy = t.admin;

  const [authed, setAuthed] = useState(
    () => localStorage.getItem(ADMIN_AUTH_KEY) === "true",
  );
  const [menu, setMenu] = useState(() => getInitialMenu());
  const [menuLoaded, setMenuLoaded] = useState(false);
  const [saveStatus, setSaveStatus] = useState("idle");
  const [previewOpen, setPreviewOpen] = useState(false);
  useEffect(() => {
    let active = true;

    if (!authed) {
      setMenuLoaded(false);
      return () => {
        active = false;
      };
    }

    getMenu().then((nextMenu) => {
      if (!active) return;
      setMenu(nextMenu);
      setMenuLoaded(true);
    });

    return () => {
      active = false;
    };
  }, [authed]);

  useEffect(() => {
    if (!authed || !menuLoaded) return;

    let active = true;
    saveMenu(menu)
      .then(() => {
        if (!active) return;
        window.dispatchEvent(new Event("boldbrew:menuUpdated"));
        setSaveStatus("saved");
      })
      .catch((err) => {
        if (!active) return;
        console.error("Menu save failed:", err);
        setSaveStatus("idle");
      });

    const timeout = setTimeout(() => {
      if (active) setSaveStatus("idle");
    }, 1800);

    return () => {
      active = false;
      clearTimeout(timeout);
    };
  }, [menu, authed, menuLoaded]);

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

  const handleRemoveCategory = (catId) => {
    setMenu((prev) => prev.filter((cat) => cat.id !== catId));
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

  const statCards = [
    { label: copy.page.stats.categories, value: menu.length },
    { label: copy.page.stats.items, value: totalItems },
  ];

  return (
    <div className="min-h-screen bg-taupe-100">
      <header className="sticky top-0 z-40 border-b border-taupe-200 bg-taupe-50/95 backdrop-blur-sm">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-12">
          <div className="flex items-center gap-4">
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

            <div className="h-5 w-px bg-taupe-200" />

            <div className="flex select-none flex-col leading-none">
              <span className="font-display text-base font-light uppercase tracking-[0.15em] text-taupe-900 sm:text-lg">
                {copy.topbar.brand}
              </span>
              <span className="font-body text-[9px] font-light uppercase tracking-[0.35em] text-taupe-500">
                {copy.topbar.admin}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`hidden font-body text-[11px] tracking-wider text-taupe-600 transition-all duration-500 sm:block ${saveStatus === "saved" ? "opacity-100" : "opacity-0"}`}
            >
              {copy.topbar.saved}
            </span>

            {/* Mobile: icons only */}
            <div className="flex items-center gap-2 sm:hidden">
              <PreviewButton
                onClick={() => setPreviewOpen(true)}
                label={copy.topbar.preview}
                compact
              />
              <ResetButton
                onClick={handleReset}
                label={copy.topbar.reset}
                compact
              />
              <LogoutButton
                onClick={handleLogout}
                label={copy.topbar.logout}
                compact
              />
            </div>

            {/* desktop */}
            <div className="hidden items-center gap-2 sm:flex">
              <PreviewButton
                onClick={() => setPreviewOpen(true)}
                label={copy.topbar.preview}
              />
              <ResetButton onClick={handleReset} label={copy.topbar.reset} />
              <LogoutButton onClick={handleLogout} label={copy.topbar.logout} />
            </div>
          </div>
        </nav>
      </header>

      <AdminPreviewModal
        open={previewOpen}
        title={copy.topbar.preview}
        closeLabel={copy.topbar.backToSite}
        onClose={() => setPreviewOpen(false)}
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-12">
        <section className="mb-8">
          <p className="mb-2 text-[10px] uppercase tracking-[0.25em] text-taupe-600">
            {copy.page.kicker}
          </p>
          <h1 className="mb-2 font-display text-3xl font-light italic text-taupe-900 sm:text-4xl">
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
                <p className="font-display text-3xl font-light text-taupe-900">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="border border-taupe-300 bg-taupe-50 p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-3 border-b border-taupe-300 pb-3">
            <h2 className="font-body text-[11px] uppercase tracking-[0.2em] text-taupe-600">
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
              onRemoveCategory={handleRemoveCategory}
              onDragEnd={handleDragEnd}
              onUpdateLabel={handleUpdateLabel}
              text={copy}
            />
          ))}

          <button
            onClick={handleAddCategory}
            className="flex w-full items-center justify-center gap-2 border border-dashed border-taupe-400 py-4 font-body text-xs uppercase tracking-widest text-taupe-600 transition-colors hover:border-taupe-700 hover:text-taupe-700"
          >
            <PlusIcon size={13} /> {copy.headers.addCategory}
          </button>
        </section>
      </div>
    </div>
  );
}
