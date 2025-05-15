
import { SignUp } from '@clerk/nextjs'


export default function Page() {
	return (
		<div className="hero gb-base-200 min-h-screen">
			<div className="hero-content text-center">
        <div className="max-w-md">
          <SignUp />
        </div>

      </div>
		</div>
	);
}
