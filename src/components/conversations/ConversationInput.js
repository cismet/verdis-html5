import React, { useCallback, useEffect, useRef, useState } from 'react';
import TextareaAutosize from 'react-autosize-textarea';
import { FormGroup, InputGroup } from 'react-bootstrap';
import { useDropzone } from 'react-dropzone';
import { Icon } from 'react-fa';
import Documents from './Documents';
import './style.css';
const Comp = ({
	setDraft = () => {},
	maxRows = 4,
	scrollToInput = () => {},
	subText = (
		<div>
			Mit <Icon name='arrow-up' /> können Sie Ihre letzte, noch nicht eingereichte Nachricht
			erneut editieren.
		</div>
	),
	lastUserMessage,
	removeLastUserMessage = () => {
		console.log('remove last user message');
	},
	uploadCRDoc = () => {}
}) => {
	const textarea = useRef();
	const [ position, setPosition ] = useState(0);
	const [ msgTextValue, setMsgTextValue ] = useState('');
	const [ msgAttachments, setMsgAttachments ] = useState([]);

	useEffect(() => {
		if (textarea && textarea.current) {
			textarea.current.selectionStart = position;
			textarea.current.selectionEnd = position;
		}
	});
	useEffect(() => {
		setTimeout(() => {
			scrollToInput();
		}, 500);
	}, []);

	const onDrop = useCallback((acceptedFiles) => {
		acceptedFiles.forEach((file) =>
			uploadCRDoc(file, (returnedFO) => {
				addAttachment(returnedFO);
			})
		);
	}, []);
	const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

	const addAttachment = (fileO) => {
		setMsgAttachments((msga) => {
			const newMsgAttachments = JSON.parse(JSON.stringify(msga));
			newMsgAttachments.push(JSON.parse(fileO));
			return newMsgAttachments;
		});
	};

	// const rowNumbersInDraft = value.split(/\r\n|\r|\n/).length;
	// if (rowNumbersInDraft < 1) {
	// 	rows = 1;
	// } else if (rowNumbersInDraft < maxRows + 1) {
	// 	rows = rowNumbersInDraft;
	// } else {
	// 	rows = maxRows;
	// }

	return (
		<div style={{ margin: '0px', marginTop: '30px' }}>
			<Documents docs={msgAttachments} setDocs={setMsgAttachments} />

			<FormGroup>
				<InputGroup>
					{/* <InputGroup.Button>
					<Button>Before</Button>
				</InputGroup.Button> */}
					<InputGroup.Addon style={{ cursor: 'pointer', verticalAlign: 'bottom' }}>
						<div {...getRootProps()}>
							<input {...getInputProps()} />
							{isDragActive ? (
								<Icon style={{ marginBottom: 3 }} name='arrow-up' />
							) : (
								<Icon style={{ marginBottom: 3 }} name='paperclip' />
							)}
						</div>
					</InputGroup.Addon>
					<TextareaAutosize
						ref={textarea}
						style={{ resize: 'none', minHeight: '34px', textAlign: 'right' }}
						className='basicSelectionColor form-control'
						value={msgTextValue}
						maxRows={12}
						onChange={(e) => {
							if (textarea && textarea.current) {
								setMsgTextValue(e.target.value);
								setPosition(textarea.current.selectionStart);
							}
						}}
						onKeyDown={(e) => {
							if (textarea && textarea.current) {
								if (e.keyCode === 13 && !e.altKey) {
									//normal return - should send content as draft
									const draft = e.target.value;
									setMsgTextValue('');

									setDraft(draft, msgAttachments);
									setMsgAttachments([]);
									e.preventDefault();
									scrollToInput();
								} else if (e.keyCode === 13 && e.altKey) {
									//alt-return - should not send, but insert a linebreak
									setMsgTextValue(
										e.target.value.substring(
											0,
											textarea.current.selectionStart
										) +
											'\n' +
											e.target.value.substring(
												textarea.current.selectionStart
											)
									);
									setPosition(textarea.current.selectionStart + 1);
								} else if (e.target.value === '' && e.keyCode === 38) {
									// arrow up - should edit the last draft message
									if (lastUserMessage !== undefined) {
										removeLastUserMessage();
										setMsgTextValue(lastUserMessage.nachricht);
										setMsgAttachments(lastUserMessage.anhang);
										setTimeout(() => {
											setPosition(lastUserMessage.nachricht.length + 100);
										}, 10);
									}
								}
							}
						}}
					/>
					<InputGroup.Addon style={{ cursor: 'pointer', verticalAlign: 'bottom' }}>
						<Icon
							onClick={(e) => {
								if (textarea && textarea.current) {
									const draft = textarea.current.value;
									setMsgTextValue('');
									setDraft(draft, msgAttachments);
									setMsgAttachments([]);
									e.preventDefault();
									scrollToInput();
								}
							}}
							style={{ marginBottom: 3 }}
							name='arrow-circle-right'
						/>
					</InputGroup.Addon>
				</InputGroup>
				<div
					style={{
						margin: 0,
						marginTop: 0,
						padding: 2,

						color: 'grey',
						XborderTop: '2px solid grey',
						fontSize: '12px'
					}}
				>
					<div style={{ minHeight: 25 }} {...getRootProps()}>
						<input {...getInputProps()} />
						<div style={{ textAlign: 'right' }}>{subText}</div>
					</div>
				</div>
			</FormGroup>
		</div>
	);
};
export default Comp;