String.prototype.capitalize = function() {
	if (this[0]) return this[0].toUpperCase() + this.slice(1);
};

Array.prototype.shuffle = function () {

    var tmp, current, top = this.length;

    if(top) while(--top) {
        current = Math.floor(Math.random() * (top + 1));
        tmp = this[current];
        this[current] = this[top];
        this[top] = tmp;
    }

    return this;
};