const copyText = async (textToCopy, msg = '복사되었습니다') => {
  try {
    await navigator.clipboard.writeText(textToCopy);
    alert(msg);
  } catch (error) {
    console.error("Error copying text:", error);
  }
};

export { copyText };
