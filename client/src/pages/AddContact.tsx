import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { IconArrowLeft } from "@/components/Icons";

const RELATIONSHIPS = ["Partner", "Friend", "Family", "Therapist", "Other"];

export default function AddContact() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isPrimary, setIsPrimary] = useState(false);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [relationship, setRelationship] = useState(RELATIONSHIPS[0]);

  const mutation = useMutation({
    mutationFn: () =>
      apiRequest("POST", "/api/contacts", {
        firstName,
        lastName,
        isPrimary,
        phone,
        email: email || null,
        relationship,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contacts"] });
      toast({ title: "Contact added! 🫂", description: "They've been added to your circle." });
      setLocation("/contacts");
    },
  });

  const canSubmit = firstName.trim() && lastName.trim() && phone.trim() && !mutation.isPending;

  return (
    <div className="flex flex-col min-h-full px-5 pt-5 pb-8">
      {/* Top bar */}
      <div className="flex items-center gap-3 mb-6">
        <button
          data-testid="button-back"
          onClick={() => setLocation("/contacts")}
          className="w-9 h-9 flex items-center justify-center rounded-2xl bg-white border border-slate-300"
        >
          <IconArrowLeft size={18} />
        </button>
        <h1 className="text-lg font-bold text-slate-900">Add Contact</h1>
      </div>

      {/* Avatar placeholder */}
      <div className="flex flex-col items-center mb-6">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mb-2 text-3xl shadow-md"
          style={{ background: "linear-gradient(135deg, #fde68a, #fca5a5)" }}
        >
          👤
        </div>
        <button className="text-xs text-violet-500 font-semibold" data-testid="button-add-image">
          Add Image
        </button>
      </div>

      {/* Form */}
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1 block">First Name</label>
            <input
              data-testid="input-first-name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Alex"
              className="w-full bg-white rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none placeholder-gray-400"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1 block">Last Name</label>
            <input
              data-testid="input-last-name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Rivera"
              className="w-full bg-white rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none placeholder-gray-400"
            />
          </div>
        </div>

        {/* Primary toggle */}
        <div className="flex items-center justify-between bg-white rounded-xl border border-slate-300 px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-slate-900">Primary Contact</p>
            <p className="text-xs text-slate-600">Notified first in an emergency</p>
          </div>
          <button
            data-testid="toggle-primary"
            onClick={() => setIsPrimary((p) => !p)}
            className={`w-12 h-6 rounded-full transition-all duration-300 relative ${
              isPrimary ? "bg-pink-400" : "bg-gray-200"
            }`}
          >
            <div
              className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all duration-300 ${
                isPrimary ? "left-6" : "left-0.5"
              }`}
            />
          </button>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-600 mb-1 block">Phone Number</label>
          <input
            data-testid="input-phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1 (555) 000-0000"
            type="tel"
            className="w-full bg-white rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none placeholder-gray-400"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-600 mb-1 block">Email (optional)</label>
          <input
            data-testid="input-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="alex@email.com"
            type="email"
            className="w-full bg-white rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none placeholder-gray-400"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-600 mb-1 block">Relationship</label>
          <div className="flex gap-2 flex-wrap">
            {RELATIONSHIPS.map((r) => (
              <button
                key={r}
                data-testid={`rel-${r.toLowerCase()}`}
                onClick={() => setRelationship(r)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                  relationship === r
                    ? "bg-gray-900 text-white"
                    : "bg-white text-gray-700 border border-slate-300"
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
          className="w-full py-4 rounded-2xl text-white font-bold text-sm shadow-md active:scale-95 transition-transform disabled:opacity-50"
          style={{ background: "linear-gradient(135deg, #f472b6, #ec4899)" }}
        >
          {mutation.isPending ? "Adding..." : "Add Contact & Send Invitation"}
        </button>
      </div>
    </div>
  );
}
