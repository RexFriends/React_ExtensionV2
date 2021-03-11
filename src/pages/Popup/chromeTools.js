  // Reusable Methods
  export const getState = (string) => {
    chrome.storage.local.get(string, res => {
      if (res[string]){
        console.log("we're here")
        return res[string]
      }else{
        return undefined
      }
    })
  }

  export const updateState = (name, value) => {
    chrome.storage.local.set({[name]: value})
    // console.log({[name]: value})
  }



  export const clearState = (key) => {
    chrome.storage.local.remove(key)
  }

