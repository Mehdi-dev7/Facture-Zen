"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import { Layers } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { checkAndAddUser } from "../actions";

export default function Navbar() {
	const pathname = usePathname();
	const { user } = useUser();

	const navLinks = [
		{
			href: "/",
			label: "Factures",
		},
	];

	useEffect(() => {
		const addUserToDatabase = async () => {
			if (!user) return;

			try {
				// Attendre que les données de l'utilisateur soient disponibles
				await user.reload();

				const email =
					user.emailAddresses?.[0]?.emailAddress ||
					user.primaryEmailAddress?.emailAddress;
				const name =
					user.fullName ||
					(user.firstName && user.lastName
						? `${user.firstName} ${user.lastName}`
						: "") ||
					user.username;

				if (email && name) {
					console.log("Tentative d'ajout utilisateur:", { email, name });
					await checkAndAddUser(email, name);
				} else {
					console.log("Données utilisateur incomplètes:", {
						email: !!email,
						name: !!name,
						userData: {
							emailAddresses: user.emailAddresses,
							primaryEmailAddress: user.primaryEmailAddress,
							fullName: user.fullName,
							firstName: user.firstName,
							lastName: user.lastName,
							username: user.username,
						},
					});
				}
			} catch (error) {
				console.error("Erreur lors de l'ajout de l'utilisateur:", error);
			}
		};

		addUserToDatabase();
	}, [user?.id]);

	const isActiveLink = (href: string) => {
		return pathname.replace(/^\//, "") === href.replace(/^\//, "");
	};

	const renderLinks = (classNames: string) => {
		return navLinks.map((link) => (
			<Link
				href={link.href}
				key={link.href}
				className={` btn-sm ${classNames} ${
					isActiveLink(link.href) ? "btn-accent" : ""
				}`}
			>
				{link.label}
			</Link>
		));
	};

	return (
		<div className="border-b border-base-300 p-5 md:px-[10%] py-4">
			<div className="flex justify-between items-center">
				<div className="flex items-center gap-2">
					<div className="bg-accent-content text-accent rounded-full p-2">
						<Layers className="w-6 h-6" />
					</div>
					<span className="text-lg font-bold italic">
						Facture <span className="text-accent">Zen</span>
					</span>
				</div>
				<div className="flex items-center space-x-4">
					{renderLinks("btn")}
					<UserButton />
				</div>
			</div>
		</div>
	);
}
