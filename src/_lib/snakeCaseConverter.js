export default (object) => {

const  newObject = {};

function camelToUnderscore(key) {
    return key.replace( /([A-Z])/g, "_$1" ).toLowerCase();
}

for(var camel in object) {
    newObject[camelToUnderscore(camel)] = original[camel];
}
return newObject;
}