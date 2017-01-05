autotrace
========

A simple interface for converting raster images into vector graphics using AutoTrace.

More details about AutoTrace can be found [here][1].


Requirements
--------

* [AutoTrace][1]


Installation
--------

    $ npm install -g autotrace


Output Formats
--------
Typical output formats include EPS, AI, SVG, DXF, PDF, MIF and Cairo. All supported output formats can be found by running;

```sh
autotrace --help
```

Basic Usage
--------
Convert a PNG to SVG.

```javascript
// input file, options and a callback
autotrace('/path/to/image.png', {
	outputFile: '/tmp/out.svg'
}, function(err, buffer) {
	if (!err) console.log('done');
});

// options and a callback
autotrace({
	inputFile: '/path/to/image.png'
	, outputFile: '/tmp/out.eps'
}, function(err, buffer) {
	if (!err) console.log('done');
});

// chaining
autotrace()
	.inputFile('/path/to/image.png')
	.outputFile('/tmp/out.pdf')
	.exec(function(err, buffer) {
		if (!err) console.log('done');
	});
```

Streams
--------
```javascript
// stream output to a WriteableStream
autotrace('/path/to/image.png')
	.outputFormat('svg')
	.stream(function(err, stdout, stderr) {
		var writeStream = fs.createWriteStream('/tmp/out.svg');
  		stdout.pipe(writeStream);
	});
	
// without a callback, .stream() returns a stream
// this is just a convenience wrapper for above.
var writeStream = fs.createWriteStream('/tmp/out.pdf');
autotrace('/path/to/image.png', {outputFormat: 'pdf'})
	.stream()
	.pipe(writeStream);
```

API
--------

**autotrace(inputFile, options, callback)**

The first argument can be either a file path or an options object. The only required option is inputFile (when not passing as the first argument); all others are optional. Refer to the above usage section for examples.

**Options/Methods** - all of AutoTrace's are supported along with some custom ones.

*AutoTrace*

    # Refer to AutoTrace's help for details.
    man autotrace

 * backgroundColor
 * centerline
 * colorCount
 * cornerAlwaysThreshold
 * cornerSurround
 * cornerThreshold
 * despeckleLevel
 * despeckleTightness
 * dpi
 * errorThreshold
 * filterIterations
 * inputFormat
 * lineReversionThreshold
 * lineThreshold
 * log
 * outputFile
 * outputFormat
 * preserveWidth
 * removeAdjacentCorners
 * tangentSurround
 * reportProgress
 * debugArch
 * debugBitmap
 * version
 * widthWeightFactor

*Custom*

* inputFile - path to the input file.
* customBin - set a custom path to the AutoTrace binary.
* binArgs - returns an array of the args to be passed to AutoTrace.
* debugExec - returns the full exec + args as a string. Useful for debugging.

**Methods**
 * exec(callback) - start the tracing process. returns (err, buffer).
 * stream - stream the results of the tracing. returns (err, stdout, stderr).

If a callback (e.g. autotrace(file, callback)) is provided the exec method is automatically called for you.
 
  [1]: http://autotrace.sourceforge.net/