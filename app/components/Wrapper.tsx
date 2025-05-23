import Navbar from "./Navbar";

type WrapperProps = {
	children: React.ReactNode;
};

export default function Wrapper({ children }: WrapperProps) {
	return (
		<div>
			<Navbar />
			<div className="px-5 md:px-[10%] mt-8 mb-10">{children}</div>
		</div>
	);
}
