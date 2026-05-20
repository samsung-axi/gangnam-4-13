import '../styles/Modal.css'

const Modal = ({ isOpen, onClose, message, children, center = false }) => {
    if (!isOpen) return null

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <div className={`modal-body${center ? ' center' : ''}`}>
                    <p className="modal-message">{message}</p>
                    {children}
                </div>
                <div className="modal-footer">
                    <button className="modal-button" onClick={onClose}>
                        확인
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Modal

