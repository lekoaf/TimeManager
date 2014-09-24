exports.email = function(email) {
    var lastAtPos = email.lastIndexOf('@');
    var lastDotPos = email.lastIndexOf('.');
    return (lastAtPos < lastDotPos && lastAtPos > 0 && email.indexOf('@@') == -1 && lastDotPos > 2 && (email.length - lastDotPos) > 2);
}

exports.pw = function(passw) {
	if (!passw.length){
		return false;
	}
	if (passw.length < 5){
		return false;
	}

	return true;
}