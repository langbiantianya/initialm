/**
 * 
 * @param { {type:String,value:String | String []}} data 
 * @returns {{type:String,value:any}}
 */
function porcessHelloCheckbox(data) {
    if (Array.isArray(data.value)) {
        return {
            type: 'text',
            value: data.value.join(",")
        }
    } else {
        return data
    }
}
/**
 * 
 * @param {{key:String,value:{type:String,value:String | String []}}} data 
 * @returns {{key:String,value:{type:String,value:any}}}
 */
function processGlobal(data) {
    return data

}

export default {
    porcessHelloCheckbox,
    processGlobal
}