import zlib from 'zlib';

const compress = (req, res, next) => {
    const acceptEncoding = req.headers['accept-encoding'];

    if(acceptEncoding && acceptEncoding.includes('gzip')) {
        const originalEnd = res.end.bind(res);
        res.end = (data) => {
            if(data && data.length > 2048) {
                res.setHeader('Content-Encoding', 'gzip');
                zlib.gzip(data, (err, compressed) => {
                    originalEnd(compressed);
                });
            } else {
                originalEnd(data);
            }
        };
    }
    next();
};

export default compress;
