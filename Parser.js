const domParser = new DOMParser();

/*
 Pattern XML	                        JSON	                                        Access
 1	<e/>	                            "e": null	                                    o.e
 2	<e>text</e>	                        "e": "text"	                                    o.e
 3	<e name="value" />	                "e":{"@name": "value"}	                        o.e["@name"]
 4	<e name="value">text</e>	        "e": { "@name": "value", "#text": "text" }	    o.e["@name"] o.e["#text"]
 5	<e> <a>text</a> <b>text</b> </e>	"e": { "a": "text", "b": "text" }	            o.e.a o.e.b
 6	<e> <a>text</a> <a>text</a> </e>	"e": { "a": ["text", "text"] }	                o.e.a[0] o.e.a[1]
 7	<e> text <a>text</a> </e>	        "e": { "#text": "text", "a": "text" }	        o.e["#text"] o.e.a
 */

function setObjectType(obj, node){
    let currentValue = obj[node.nodeName];
    if(currentValue){
        if(Array.isArray(currentValue)){
            obj[node.nodeName].push({});
        } else {
            obj[node.nodeName] = [currentValue, {}];
        }
    } else {
        obj[node.nodeName] = {};
    }
}

function parse(xmlDoc, obj){
    if(xmlDoc){
        for(var i = 0; i < xmlDoc.length; i++){
            let node = xmlDoc[i];
            if(node){
                if(node.hasAttributes()){
                    setObjectType(obj, node);
                    let attributes = node.getAttributeNames(); //an array of attribute names
                    let objAttributes = {};
                    for(var j = 0; j < attributes.length; j++){
                        objAttributes["@" + attributes[j]] = node.getAttribute(attributes[j]);
                    }
                    objAttributes["#text"] = node.textContent;
                    if(Array.isArray(obj[node.nodeName])){
                        obj[node.nodeName][obj[node.nodeName].length - 1] = objAttributes;
                    } else {
                        obj[node.nodeName] = objAttributes;
                    }

                    if(node.children.length > 0){
                        // obj[node.firstElementChild.nodeName] = {};
                        parse(node.children, obj); //send obj with that name
                    }
                } else if(node.children.length > 0){
                    setObjectType(obj, node);
                    parse(node.children, Array.isArray(obj[node.nodeName]) ? obj[node.nodeName][obj[node.nodeName].length - 1] : obj[node.nodeName]); //send obj with that name
                } else {
                    let doc = domParser.parseFromString(node.textContent, 'text/html');
                    obj[node.nodeName] = doc.body.textContent || "";
                }
            }
        }

    } else {
        console.error("List is not defined");
    }
}

export default function convertXmlToJson(xmlString){
    let obj = {};
    let xml = domParser.parseFromString(xmlString, "application/xml");
    if(xml){
        parse(xml.children, obj);
        // console.log(obj);
    } else {
        console.log("Invalid XML string: " + xmlString);
    }
    return obj;
}
