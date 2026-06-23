import { redirect } from "next/navigation";

/**
 * Root page — redirect ke login.
 * AuthGuard akan mengarahkan ke /dashboard jika sudah login.
 */
export default function HomePage() {
  redirect("/login");
}