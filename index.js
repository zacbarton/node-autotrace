var path = require('path');
var spawn = require('child_process').spawn;
var PassThrough = require('stream').PassThrough;

module.exports = AutoTrace;

function AutoTrace(inputFile, options, callback) {
	if (!(this instanceof AutoTrace)) {
		return new AutoTrace(inputFile, options, callback);
	}
	
	this.args = [];
	this.inputFile;
	this.bin = 'autotrace';
	
	if (options && typeof options === 'object') {
		options.inputFile = inputFile;
	} else if (inputFile && typeof inputFile === 'object') {
		callback = options;
		options = inputFile;
	} else if (typeof inputFile === 'string') {
		callback = options;
		options = {inputFile: inputFile};
	}
	
	this.init(options);
	
	if (callback) {
		return this.exec(callback);
	}
	
	return this;
}

AutoTrace.prototype.init = function(options) {
	for (var i in options) {
		if (this[i] && typeof this[i] === 'function') {
			this[i](options[i]);
		}
	}
};

AutoTrace.prototype.backgroundColor = function(color) {
	this.args.push('-background-color', color);
	return this;
};

AutoTrace.prototype.centerline = function(value) {
	if (!!value) this.args.push('-centerline');
	return this;
};

AutoTrace.prototype.colorCount = function(value) {
	this.args.push('-color-count', parseInt(value));
	return this;
};

AutoTrace.prototype.cornerAlwaysThreshold = function(value) {
	this.args.push('-corner-always-threshold', parseFloat(value));
	return this;
};

AutoTrace.prototype.cornerSurround = function(value) {
	this.args.push('-corner-surround', parseInt(value));
	return this;
};

AutoTrace.prototype.cornerThreshold = function(value) {
	this.args.push('-corner-threshold', parseFloat(value));
	return this;
};

AutoTrace.prototype.despeckleLevel = function(value) {
	this.args.push('-despeckle-level', parseInt(value));
	return this;
};

AutoTrace.prototype.despeckleTightness = function(value) {
	this.args.push('-despeckle-tightness', parseFloat(value));
	return this;
};

AutoTrace.prototype.dpi = function(value) {
	this.args.push('-dpi', parseInt(value));
	return this;
};

AutoTrace.prototype.errorThreshold = function(value) {
	this.args.push('-error-threshold', parseFloat(value));
	return this;
};

AutoTrace.prototype.filterIterations = function(value) {
	this.args.push('-filter-iterations', parseInt(value));
	return this;
};

AutoTrace.prototype.inputFormat = function(value) {
	this.args.push('-input-format', value);
	return this;
};

AutoTrace.prototype.lineReversionThreshold = function(value) {
	this.args.push('-line-reversion-threshold', parseFloat(value));
	return this;
};

AutoTrace.prototype.lineThreshold = function(value) {
	this.args.push('-line-threshold', parseFloat(value));
	return this;
};

AutoTrace.prototype.log = function(value) {
	if (!!value) this.args.push('-log');
	return this;
};

AutoTrace.prototype.outputFile = function(file) {
	this.args.push('-output-file', file);
	return this;
};

AutoTrace.prototype.outputFormat = function(format) {
	this.args.push('-output-format', format);
	return this;
};

AutoTrace.prototype.preserveWidth = function(value) {
	if (!!value) this.args.push('-preserve-width');
	return this;
};

AutoTrace.prototype.removeAdjacentCorners = function(value) {
	if (!!value) this.args.push('-remove-adjacent-corners');
	return this;
};

AutoTrace.prototype.tangentSurround = function(value) {
	this.args.push('-tangent-surround', parseInt(value));
	return this;
};

AutoTrace.prototype.reportProgress = function(value) {
	if (!!value) this.args.push('-report-progress');
	return this;
};

AutoTrace.prototype.debugArch = function(value) {
	if (!!value) this.args.push('-debug-arch');
	return this;
};

AutoTrace.prototype.debugBitmap = function(value) {
	if (!!value) this.args.push('-debug-bitmap');
	return this;
};

AutoTrace.prototype.version = function(value) {
	if (!!value) this.args.push('-version');
	return this;
};

AutoTrace.prototype.widthWeightFactor = function(value) {
	this.args.push('-width-weight-factor', parseFloat(value));
	return this;
};

/* custom methods */
AutoTrace.prototype.inputFile = function(file) {
	this.inputFile = file;
	return this;
};

AutoTrace.prototype.binArgs = function() {
	return [].concat(this.args, this.inputFile);
};

AutoTrace.prototype.customBin = function(path) {
	this.bin = path;
	return this;
};

AutoTrace.prototype.debugExec = function(value) {
	if (!!value) console.log(this.bin, this.binArgs().join(' '));
	return this;
};

AutoTrace.prototype.exec = function(callback) {
	var err = '';
	var buffer = '';
	var trace = spawn(this.bin, this.binArgs());
	
	trace.stdout.on('data', function(data) {
		buffer += data;
	});
	
	trace.stderr.on('data', function(data) {
		err += data;
	});
	
	trace.stdout.on('close', function(code) {
		if (callback) {
			callback(err || code, buffer ? new Buffer(buffer) : null);
		}
	});
};

AutoTrace.prototype.stream = function(callback) {
	var throughStream;
	
	if (typeof callback !== 'function') {
		throughStream = new PassThrough();
		
		callback = function(err, stdout, stderr) {
			stdout.pipe(throughStream);
		};
	}
	
	var trace = spawn(this.bin, this.binArgs());
	
	callback.call(this, null, trace.stdout, trace.stderr);
	
	return throughStream || this;
};