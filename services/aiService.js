const Conversation =require('../models/Conversation.js');
const Message =require('../models/Message.js');
const { GoogleGenerativeAI } =require('@google/generative-ai');
const createError = require('../utils/createError.js')
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });


const getAiConversation = async (userId) => {
  let conversation = await Conversation.findOne({
    type: 'ai',
    participants: userId,
  });

  if (!conversation) {
    conversation = await Conversation.create({
      type: 'ai',
      participants: [userId],
    });
  }

  return conversation;
};



const chatWithAI = async (userId, messageText) => {
  const conversation = await getAiConversation(userId);

  const userMessage = await Message.create({
    conversation: conversation._id,
    sender: userId,
    senderType: 'user',
    content: messageText,
  });

  // Fetch recent history
  const history = await Message.find({
    conversation: conversation._id,
  })
    .sort({ createdAt: 1 })
    .limit(10);

  const formattedHistory = history.map((msg) => ({
    role: msg.senderType === 'ai' ? 'model' : 'user',
    parts: [{ text: msg.content }],
  }));

  const chat = model.startChat({ history: formattedHistory });

  const result = await chat.sendMessage(messageText);
  const aiReply = result.response.text();

  // Save AI reply
  const aiMessage = await Message.create({
    conversation: conversation._id,
    sender: null,
    senderType: 'ai',
    content: aiReply,
  });

  conversation.lastMessage = aiMessage._id;
  await conversation.save();

  return { reply: aiReply };
};


const recommendHouses = async (userId, filters) => {
  const conversation = await getAiConversation(userId);

  const listedHouses = await House.find({
    rent: { $lte: filters.maxBudget },
    location: filters.location,
    bedrooms: { $gte: filters.bedrooms || 1 },
  }).limit(5);

  let listedSummary = '';

  if (listedHouses.length > 0) {
    listedSummary = listedHouses
      .map(
        (h) =>
          `₦${h.rent} - ${h.bedrooms}BR in ${h.location}. ${h.description}`
      )
      .join('\n');
  }

 
  const externalPrompt = `
You are a Nigerian rental market expert.

Suggest 2–3 rental options in ${filters.location}, Calabar,
within a budget of ₦${filters.maxBudget}.
These houses are NOT listed on the platform.

Clearly state they are market-based suggestions only.
Do NOT invent exact addresses or landlords.
Keep it realistic.
`;

  const externalResult = await model.generateContent(externalPrompt);
  const externalSuggestions = externalResult.response.text();

  
  const finalPrompt = `
You are an AI rental assistant.

First, recommend from the available platform listings below.
Then, provide market-based suggestions that are NOT listed on this platform.

--- PLATFORM LISTINGS ---
${listedSummary || 'No matching houses currently listed on this platform.'}

--- MARKET SUGGESTIONS ---
${externalSuggestions}

IMPORTANT:
• Clearly label which houses are listed and which are not.
• State that external houses cannot be transacted or escrowed on this platform.
• Be concise and helpful.
`;

  const finalResult = await model.generateContent(finalPrompt);
  const reply = finalResult.response.text();

  await saveAiMessage(conversation._id, reply, 'recommendHouses');

  return {
    listed: listedHouses,
    external: externalSuggestions,
    reply,
  };
};




const analyzeRent = async (userId, houseId) => {
  const conversation = await getAiConversation(userId);

  const house = await House.findById(houseId);
  if (!house) throw new Error('House not found');

  const prompt = `
Analyze whether this rent is fair in Calabar, Nigeria.

House details:
Location: ${house.location}
Rent: ₦${house.rent}
Bedrooms: ${house.bedrooms}
Condition: ${house.condition}

Explain if the price is fair, high, or low.
`;

  const result = await model.generateContent(prompt);
  const reply = result.response.text();

  await saveAiMessage(conversation._id, reply, 'analyzeRent');

  return { reply };
};


const explainPrice = async (userId, houseId) => {
  const conversation = await getAiConversation(userId);

  const house = await House.findById(houseId);
  if (!house) throw new Error('House not found');

  const prompt = `
Explain why this house may be priced at ₦${house.rent}.

Consider:
- Location
- Demand
- Amenities
- Market conditions in Nigeria

Keep it simple and clear.
`;

  const result = await model.generateContent(prompt);
  const reply = result.response.text();

  await saveAiMessage(conversation._id, reply, 'explainPrice');

  return { reply };
};


module.exports =  {
  chatWithAI,
  recommendHouses,
  analyzeRent,
  explainPrice,
  getAiConversation
} ;