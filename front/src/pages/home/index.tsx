import { ChatBox } from "components/chat/ChatBox";
import { SideBar } from "components/layouts/SideBar";
import { browserNotification } from "helpers/browserNotification.helper";

export function Home() {

	browserNotification.askForPermission()

	return (
		<div className="home__container">
			<SideBar />
			<ChatBox />
		</div>
	)
}