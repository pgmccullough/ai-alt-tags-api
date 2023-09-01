export const scanImage = async (imageUrl: string): Promise<string> => {
  try {
    const url = `${Deno.env.get("IMAGGA_API_ENDPOINT")}${encodeURIComponent(imageUrl)}`;
    const response = await fetch(url, {
      headers: {
        'Authorization': `Basic ${btoa(`${Deno.env.get("IMAGGA_API_KEY")}:${Deno.env.get("IMAGGA_API_SECRET")}`)}`
      }
    });
    return await response.json();
  } catch (error) {
    return error;
  }
};
