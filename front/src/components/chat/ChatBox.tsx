import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react'
import { Button, Card, Col, Row } from 'react-bootstrap'
import { setChatLoading, setSelectedChat, setSelectedChatMessages } from 'store/actions/chat/chat.actions'
import { useAppDispatch, useAppSelector } from 'store/helpers'
import { API_PATHS } from 'utils/apis'
import dayjs from 'dayjs'
import { useRequest } from 'hooks/useRequest.hook'
import { socket } from 'socket'
import { SocketEvents } from 'helpers/socket.event.types'
import { browserNotification } from 'helpers/browserNotification.helper'
import { Phone, CameraVideo } from 'react-bootstrap-icons';


export function ChatBox() {
	const dispatch = useAppDispatch()

	function handleNewIncomingMessage(message: any) {
		dispatch(setSelectedChatMessages({
			messages: [message],
			isNew: true
		}))
		browserNotification.showNotification({
			type: 'message',
			data: message,
			onClick: onNotificationClick
		})
	}

	function onNotificationClick(chatId: string) {
		dispatch(setSelectedChat(chatId))
	}

	function scrollBelow() {
		const chatBox = document.querySelector('.chat-box__container')
		if (chatBox) {
			chatBox.scrollTo({
				top: chatBox.scrollHeight + 10000,
				behavior: 'smooth'
			})
		}
	}

	function makeAudioCall() {
		console.log('audio call...')
	}

	function makeVideoCall() {
		console.log('video call...')
	}

	useEffect(() => {
		socket.listenEvent(SocketEvents.NEW_MESSAGE, handleNewIncomingMessage)
	}, [])

	const [message, setMessage] = useState<string>('')
	const [chatCount, setChatCount] = useState(0)
	const [loadMoreMessageLoading, setLoadMoreMessageLoading] = useState<boolean>(false)
	const [sendMessageLoading, setSendMessageLoading] = useState<boolean>(false)
	const isMergeRef = useRef<boolean>(false)

	const chatLoading = useAppSelector(state => state.chat.chatLoading)
	const currentUserId = useAppSelector(state => state.auth.user?._id)
	const selectedChat = useAppSelector(state => state.chat.selectedChat)
	const selectedChatInfo = useAppSelector(state => state.chat.selectedChatInfo) as any
	const selectedChatMessages = useAppSelector(state => state.chat.selectedChatMessages)

	const [sendMessage] = useRequest({
		url: API_PATHS.chat.sendMessage,
		method: 'post',
		showNotification: false,
		loadingFn: setSendMessageLoading,
		onSuccess: onSendMessageSuccess
	})

	const [loadMoreMessages] = useRequest({
		url: API_PATHS.chat.messages,
		showNotification: false,
		loadingFn: setLoadMoreMessageLoading,
		onSuccess: onLoadMoreMessagesSuccess,
		onError: () => dispatch(setChatLoading(false))
	})

	function onSendMessageSuccess(data: any) {
		if (!data) return
		setMessage('')
		setSendMessageLoading(false)
		dispatch(setSelectedChatMessages({
			messages: [data.data],
			isNew: true
		}))
		scrollBelow()
	}

	function onLoadMoreMessagesSuccess(data: any) {
		if (!data) return
		setChatCount(data.data.count)
		dispatch(setSelectedChatMessages({
			messages: data.data.messages,
			isMerge: isMergeRef.current,
		}))
		dispatch(setChatLoading(false))
	}

	async function getChatMessages({ chatId, skip = 0, limit = 10 }: { chatId: string, skip?: number, limit?: number, isMerge?: boolean }) {
		const payload = {
			params: {
				chatId,
				limit,
				skip,
			},
		}
		loadMoreMessages(payload)
	}

	async function handleSendMessage(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()
		const payload = {
			data: {
				message,
				to: selectedChat,
			}
		}
		sendMessage(payload)
	}

	useEffect(() => {
		if (!selectedChat) return
		setMessage('')
		isMergeRef.current = false
		getChatMessages({ chatId: selectedChat })
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedChat, dispatch])

	return (
		<div className="chat-box-and-input__container">
			<div className="chat-box__container d-flex flex-column">
				{
					selectedChat && (
						<div style={{
							position: 'sticky',
							backgroundColor: 'green',
							top: 0,
							zIndex: 1,
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							padding: '5px',
							color: 'white'
						}}>
							<div style={{ display: 'flex', alignItems: 'center' }}>
								<img src={`https://avatars.dicebear.com/api/adventurer/${selectedChatInfo?.isGroup ?
									selectedChatInfo?.groupName :
									selectedChatInfo?.sender?.username}.svg`} alt='ok' style={{ borderRadius: '50%', width: '50px', height: '50px', margin: '0px 5px' }} />
								<div>
									{selectedChatInfo ?
										selectedChatInfo?.isGroup ?
											selectedChatInfo?.groupName :
											selectedChatInfo?.sender?.username
										: ''
									}
								</div>
							</div>
							<div style={{ display: 'flex', alignItems: 'center' }}>
								<div onClick={makeAudioCall} style={{ cursor: 'pointer' }}> <Phone size={40} color='white' /> </div>
								<div onClick={makeVideoCall} style={{ cursor: 'pointer' }} > <CameraVideo size={40} color='white' /> </div>
							</div>
						</div>
					)
				}
				{!chatLoading ?
					selectedChat ?
						selectedChatMessages.length ?
							<>
								{selectedChatMessages.length < chatCount && <Button color='primary'
									style={{
										marginTop: '10px',
										marginBottom: '10px',
										width: 'max-content',
										alignSelf: 'center'
									}}
									disabled={selectedChatMessages.length >= chatCount || loadMoreMessageLoading}
									onClick={() => {
										isMergeRef.current = true
										getChatMessages({ chatId: selectedChat, skip: selectedChatMessages.length, limit: 10 })
									}}
								> Load More...  </Button>}
								<div>
									{
										selectedChatMessages.map((message: any, index) => (
											<Card className='m-2 w-50' style={{
												float: currentUserId === (message?.from?._id || message?.from) ? 'right' : 'left',
												minHeight: "2rem",
											}} key={index}>
												<Row>
													<Col sm={8}>
														{message.message}
													</Col>
													<Col sm={4}>
														{dayjs(message.date).format('DD-MM-YYYY / HH:mm')}
													</Col>
												</Row>
											</Card>
										))
									}
								</div>
							</>
							: "No Messages Found..."
						: "Select A Chat to start messaging..."
					: "Loading Messages..."
				}
			</div>
			<form className="chat-box-message-input__container" onSubmit={handleSendMessage}>
				<input value={message} type="text" disabled={sendMessageLoading || !selectedChat} className="chat-box__message-input" onChange={(e: ChangeEvent<HTMLInputElement>) => setMessage(e.target.value)} />
				<Button type='submit' disabled={!message.length || sendMessageLoading} > Send </Button>
			</form>
		</div >
	)
}