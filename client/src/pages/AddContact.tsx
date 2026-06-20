import { useRef, useState, useEffect } from "react";
import { useLocation, useSearch, useParams } from "wouter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { parseApiError } from "@/lib/api-error";
import { useToast } from "@/hooks/use-toast";
import { IconArrowLeft, IconUser } from "@/components/Icons";
import { type Contact } from "@shared/schema";

const RELATIONSHIPS = ["Partner", "Friend", "Family", "Therapist", "Other"];

export default function AddContact() {
  const params = useParams<{ id?: string }>();
  const contactId = params.id;
  const isEditing = Boolean(contactId);
  const [, setLocation] = useLocation();
  const search = useSearch();
  const returnToSignal = new URLSearchParams(search).get("from") === "signal";
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: existing } = useQuery<Contact>({
    queryKey: ["/api/contacts", contactId],
    enabled: isEditing,
  });

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isPrimary, setIsPrimary] = useState(false);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [relationship, setRelationship] = useState(RELATIONSHIPS[0]);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!existing) return;
    setFirstName(existing.firstName);
    setLastName(existing.lastName);
    setIsPrimary(existing.isPrimary);
    setPhone(existing.phone);
    setEmail(existing.email ?? "");
    setRelationship(existing.relationship);
    setImageUrl(existing.imageUrl ?? null);
  }, [existing]);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file",
        description: "Please choose an image file.",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setImageUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const mutation = useMutation({
    mutationFn: () => {
      const payload = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        isPrimary,
        phone: phone.trim(),
        email: email.trim() || null,
        relationship,
        imageUrl,
      };
      return isEditing
        ? apiRequest("PATCH", `/api/contacts/${contactId}`, payload)
        : apiRequest("POST", "/api/contacts", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contacts"] });
      toast({
        title: isEditing ? "Contact updated!" : "Contact added!",
        description: isEditing ? "Your circle has been updated." : "They've been added to your circle.",
      });
      const fromSignal =
        new URLSearchParams(window.location.search).get("from") === "signal";
      setLocation(fromSignal ? "/emergency" : "/contacts");
    },
    onError: (error) => {
      toast({
        title: "Could not add contact",
        description: parseApiError(error),
        variant: "destructive",
      });
    },
  });

  const canSubmit = firstName.trim() && lastName.trim() && phone.trim() && !mutation.isPending;

  return (
    <div className="flex flex-col min-h-full px-4 sm:px-5 pt-5 pb-8">
      <div className="flex items-center gap-3 mb-6">
        <button
          data-testid="button-back"
          onClick={() => setLocation(returnToSignal ? "/emergency" : "/contacts")}
          className="w-9 h-9 flex items-center justify-center rounded-2xl app-card text-[var(--app-text)]"
        >
          <IconArrowLeft size={18} />
        </button>
        <h1 className="text-lg font-bold text-[var(--app-text)]">
          {returnToSignal
            ? isEditing
              ? "Edit Emergency Contact"
              : "Add Emergency Contact"
            : isEditing
              ? "Edit Contact"
              : "Add Contact"}
        </h1>
      </div>

      <div className="flex flex-col items-center mb-6">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mb-2 text-3xl shadow-md app-card-muted overflow-hidden"
        >
          {imageUrl ? (
            <img src={imageUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            <IconUser size={36} color="var(--app-muted)" />
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          data-testid="input-contact-image"
          onChange={handleImageSelect}
        />
        <button
          type="button"
          className="text-xs text-[var(--app-primary)] font-semibold"
          data-testid="button-add-image"
          onClick={() => fileInputRef.current?.click()}
        >
          Add Image
        </button>
      </div>

      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-[var(--app-muted)] mb-1 block">
              First Name
            </label>
            <input
              data-testid="input-first-name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Alex"
              className="w-full app-input rounded-xl px-4 py-3 text-sm outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-[var(--app-muted)] mb-1 block">
              Last Name
            </label>
            <input
              data-testid="input-last-name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Rivera"
              className="w-full app-input rounded-xl px-4 py-3 text-sm outline-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-between app-card rounded-xl px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-[var(--app-text)]">Primary Contact</p>
            <p className="text-xs text-[var(--app-muted)]">Notified first in an emergency</p>
          </div>
          <button
            type="button"
            data-testid="toggle-primary"
            role="switch"
            aria-checked={isPrimary}
            onClick={() => setIsPrimary((p) => !p)}
            className={`app-toggle ${isPrimary ? "app-toggle-on" : "app-toggle-off"}`}
          >
            <div
              className="app-toggle-knob"
              style={{ left: isPrimary ? "1.375rem" : "0.125rem" }}
            />
          </button>
        </div>

        <div>
          <label className="text-xs font-semibold text-[var(--app-muted)] mb-1 block">
            Phone Number
          </label>
          <input
            data-testid="input-phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1 (555) 000-0000"
            type="tel"
            className="w-full app-input rounded-xl px-4 py-3 text-sm outline-none"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-[var(--app-muted)] mb-1 block">
            Email (optional)
          </label>
          <input
            data-testid="input-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="alex@email.com"
            type="email"
            className="w-full app-input rounded-xl px-4 py-3 text-sm outline-none"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-[var(--app-muted)] mb-1 block">
            Relationship
          </label>
          <div className="flex gap-2 flex-wrap">
            {RELATIONSHIPS.map((r) => (
              <button
                key={r}
                data-testid={`rel-${r.toLowerCase()}`}
                onClick={() => setRelationship(r)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                  relationship === r ? "pill-active" : "pill-inactive"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <button
          data-testid="button-submit-contact"
          onClick={() => mutation.mutate()}
          disabled={!canSubmit}
          className="w-full py-4 rounded-2xl text-white font-bold text-sm shadow-md active:scale-95 transition-transform disabled:opacity-50 btn-gradient"
        >
          {mutation.isPending ? "Saving..." : isEditing ? "Save Changes" : "Add Contact & Send Invitation"}
        </button>
      </div>
    </div>
  );
}
