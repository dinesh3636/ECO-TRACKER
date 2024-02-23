const NoDataMessage = ({ message }) => {
    return (
        <div style={{ textAlign: 'center', width: '100%', padding: '1rem', borderRadius: '9999px', backgroundColor: 'rgba(128, 128, 128, 0.5)', marginTop: '1rem' }}>
            <p>{ message }</p>
        </div>
    )
}

export default NoDataMessage;
