const copyText = async (textToCopy) => {
  try {
    await navigator.clipboard.writeText(textToCopy);
    alert("복사되었습니다");
  } catch (error) {
    console.error("Error copying text:", error);
  }
};

export { copyText };
