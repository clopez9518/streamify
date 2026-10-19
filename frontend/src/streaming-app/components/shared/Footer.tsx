import { Link } from "react-router"

const footerSections = [
    {
        title: "Company",
        links: ["About", "Careers", "Press"]
    },
    {
        title: "Support",
        links: ["Help Center", "Contact", "Account"]
    },
    {
        title: "Legal",
        links: ["Privacy", "Terms", "Cookies"]
    },
    {
        title: "Connect",
        links: ["Twitter", "Facebook", "Instagram"]
    }
]

export const Footer = () => {
    return (
        <footer className="dark border-t border-white/10 bg-[#08090b] px-6 py-14 text-white lg:px-12">
            <div className="mx-auto max-w-7xl">
                <div className="grid gap-10 lg:grid-cols-[1.2fr_2fr] lg:gap-16">
                    <div className="max-w-sm space-y-4">
                        <Link to="/" className="inline-flex text-xl font-semibold tracking-normal text-white">
                            STREAMIFY
                        </Link>
                        <p className="text-sm leading-6 text-white/50">
                            Curated films and series in a calm, cinematic space built for uninterrupted browsing.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                        {footerSections.map((section) => (
                            <div key={section.title}>
                                <h4 className="mb-4 text-xs font-medium uppercase tracking-[0.22em] text-white/50">
                                    {section.title}
                                </h4>
                                <ul className="space-y-3">
                                    {section.links.map((link) => (
                                        <li key={link}>
                                            <Link
                                                to="#"
                                                className="text-sm text-white/60 transition-colors hover:text-white"
                                            >
                                                {link}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-white/40 md:flex-row md:items-center md:justify-between">
                    <p>(c) 2026 Streamify. All rights reserved.</p>
                    <p>Made for quiet discovery.</p>
                </div>
            </div>
        </footer>
    )
}
