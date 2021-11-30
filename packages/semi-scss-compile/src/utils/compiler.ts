import sass from 'sass';


const compile = (entryScssPath: string, isMin: boolean = false) => {
    const result = sass.renderSync({ file: entryScssPath, outputStyle: isMin ? 'compressed' : 'expanded' });
    return result;
};

export default compile;

