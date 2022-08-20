import 'components/layouts/css/sidebar.css'
import { Card, Image, Row, Col } from 'react-bootstrap'
import { str } from 'jseassy'
import { API_PATHS } from 'utils/apis'
import { useAppDispatch, useAppSelector } from 'store/helpers'
import { setChatLoading, setChats, setSelectedChat } from 'store/actions/chat/chat.actions'
import { useEffect } from 'react'
import { useRequest } from 'hooks/useRequest.hook'

// TODO fix there are too many any types fix these 🥲🥹

export function SideBar() {

	const dispatch = useAppDispatch()
	const messages = useAppSelector(state => state.chat.chats)
	const selectedChatId = useAppSelector(state => state.chat.selectedChat)

	const [getUserChats] = useRequest({
		url: API_PATHS.chat.messages,
		showNotification: false,
		onSuccess: onGetUserChatsSuccess
	})

	function onGetUserChatsSuccess(data: any) {
		if (!data) return
		dispatch(setChats(data.data))
	}

	useEffect(() => {
		const payload = {
			params: {
				limit: 1
			}
		}
		getUserChats(payload)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	function handleChatCardClick(selectedChat: string) {
		if (selectedChatId === selectedChat) return
		dispatch(setChatLoading(true))
		dispatch(setSelectedChat(selectedChat))
	}

	return (
		<div className="sidebar">
			{
				messages.map((message: any, index) => {
					return (
						<div key={index}>
							<Card
								className={`
								m-1 
								p-2 
								sidebar-card__container 
								${(selectedChatId === (message.isGroup ? message.groupName : message.sender?._id)) && 'sidebar-card__container-active'}`}
								key={index} onClick={(e: any) => handleChatCardClick(message.isGroup ? message.groupName : message.sender._id)}>
								<Row className="sidebar-card-row__container">
									<Col sm={4}>
										<Image src={`https://avatars.dicebear.com/api/adventurer/${message.isGroup ? message.groupName : message.sender.username}.svg`} rounded={true} height="50px" width="50px" />
									</Col>
									<Col sm={8} className="mt-3">
										{str.ucFirst(message.isGroup ? message.groupName : message.sender.username)} <br />
										<small>{`${message?.messages?.message ? message?.messages?.message : "No message found..."}`?.substring?.(0, 20)}{`${message?.messages?.message?.length > 20 ? "..." : ''}`}</small>
									</Col>
								</Row>
							</Card>
						</div>
					)
				})
			}
		</div >
	)
}