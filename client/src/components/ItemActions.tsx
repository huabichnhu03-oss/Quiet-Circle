type ItemActionsProps = {
  onEdit: () => void;
  onDelete: () => void;
  editLabel?: string;
  deleteLabel?: string;
};

export function ItemActions({
  onEdit,
  onDelete,
  editLabel = "Edit",
  deleteLabel = "Delete",
}: ItemActionsProps) {
  return (
    <div className="flex items-center gap-1 flex-shrink-0">
      <button
        type="button"
        onClick={onEdit}
        className="px-2.5 py-1 rounded-lg text-[10px] font-semibold app-tag"
        data-testid="button-item-edit"
      >
        {editLabel}
      </button>
      <button
        type="button"
        onClick={onDelete}
        className="px-2.5 py-1 rounded-lg text-[10px] font-semibold text-red-500 bg-red-50"
        data-testid="button-item-delete"
      >
        {deleteLabel}
      </button>
    </div>
  );
}

type EditToggleProps = {
  editing: boolean;
  onToggle: () => void;
  onSave?: () => void;
  isSaving?: boolean;
};

export function EditToggle({ editing, onToggle, onSave, isSaving }: EditToggleProps) {
  if (editing && onSave) {
    return (
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onToggle}
          className="px-3 py-1.5 rounded-full text-xs font-semibold pill-inactive"
          data-testid="button-cancel-edit"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          className="px-3 py-1.5 rounded-full text-xs font-semibold text-white btn-gradient disabled:opacity-50"
          data-testid="button-save-edit"
        >
          {isSaving ? "Saving..." : "Save"}
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onToggle}
      className="px-3 py-1.5 rounded-full text-xs font-semibold app-tag border border-[var(--app-border)]"
      data-testid="button-edit-toggle"
    >
      {editing ? "Done" : "Edit"}
    </button>
  );
}
