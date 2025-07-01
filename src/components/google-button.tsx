import { google_client } from "@/lib/constants";
import { languageStore } from "@/lib/stores";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { useStore } from "@tanstack/react-store";
import React from "react";

export function GoogleButton(props: React.ComponentProps<typeof GoogleLogin>) {
	const currentLocale = useStore(languageStore, (state) => state.currentLocale);

	return (
		<GoogleOAuthProvider clientId={google_client}>
			<GoogleLogin locale={currentLocale} {...props} />
		</GoogleOAuthProvider>
	);
}
