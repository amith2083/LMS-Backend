 export const getSlug = (title:string):string => {


    const slug = title.toLowerCase().replace(/ /g, '-')
    .replace(/[^\w-]+/g, '');

    return slug;
  }