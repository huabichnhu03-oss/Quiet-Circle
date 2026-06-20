import { SignInButton, SignUpButton, Show, UserButton } from "@clerk/react";

export function AuthControls() {
  return (
    <>
      <Show when="signed-out">
        <SignInButton mode="redirect">
          <button
            type="button"
            data-testid="button-sign-in"
            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-violet-700 bg-violet-50 hover:bg-violet-100 transition-colors"
          >
            Sign in
          </button>
        </SignInButton>
        <SignUpButton mode="redirect">
          <button
            type="button"
            data-testid="button-sign-up"
            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-violet-600 hover:bg-violet-700 transition-colors"
          >
            Sign up
          </button>
        </SignUpButton>
      </Show>
      <Show when="signed-in">
        <UserButton
          appearance={{
            elements: {
              avatarBox: "w-8 h-8",
            },
          }}
        />
      </Show>
    </>
  );
}
