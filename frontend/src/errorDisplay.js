const errorDisplay = async(error, setError)=> {
    setError(error)
    await new Promise(resolve => setTimeout(resolve, 3000))
    setError('')
}

export default errorDisplay;
