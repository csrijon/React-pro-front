import { GoogleGenAI, Type } from "@google/genai";
import Resume from "../models/Resume.js";
import UploadedResume from "../models/UploadedResume.js";
import { purgeEmptyFormPayloads, buildPortfolioFromTextFallback, fallbackPortfolio, cleanAndMergePortfolios } from "../utils/portfolioHelpers.js";
import { compileUnifiedPortfolioHtml } from "../services/htmlService.js";

const GEMINI_SYSTEM_INSTRUCTION = `
You are an expert AI Resume Parser tuned for software engineers and professionals. Your sole purpose is to convert raw resume text into a perfectly clean, deep JSON schema structure.

CRITICAL EXTRACTION INTEGRITY LAWS:
1. Extract ALL project records, experience entries, certificates, education lines, and achievements completely. Never skip items or use phrase ellipses ("...") or notes.
2. For "education", you MUST return an array of OBJECTS containing distinct "school", "degree", and "duration" string variables. Never map a plain text string to this field. If CGPA details exist, attach them directly into the "degree" property value cleanly (e.g. "B.Tech in Computer Science (CGPA: 9.4)").
3. For "projects" and "experience", parse out comprehensive paragraphs into "description". Isolate distinct, punchy performance points into the "highlights" array node. Extract full arrays for "technologies".
4. Format dates consistently as "YYYY - YYYY" or "Month YYYY - Present". Fix space omissions in fields like "(2023 2027)" to match standard presentation guidelines ("2023 - 2027").
5. Infer an optimized professional development title role (e.g., "Full Stack Engineer") and a clean creative tagline.
6. Return purely valid JSON output.
`;

/**
 * 1. PARSE RESUME TEXT VIA GEMINI AI ENGINE
 */
export const parseResume = async (req, res) => {
  const aiEngine = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const { text } = req.body;
  const activeUserId = req.user.userId;

  if (!text || text.trim().length < 40) {
    return res.json({ result: JSON.stringify(fallbackPortfolio) });
  }

  let cleanedText = text.replace(/[^\x20-\x7E\n\r\t]/g, " ").replace(/\s+/g, " ").trim();
  const localFallbackPortfolio = buildPortfolioFromTextFallback(cleanedText);

  try {
    const response = await aiEngine.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Please read this resume text and parse all segments into the required JSON schema structures:\n\n${cleanedText}`,
      config: {
        systemInstruction: GEMINI_SYSTEM_INSTRUCTION,
        temperature: 0.1,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING }, role: { type: Type.STRING }, tagline: { type: Type.STRING }, summary: { type: Type.STRING }, email: { type: Type.STRING }, phone: { type: Type.STRING }, location: { type: Type.STRING },
            links: { type: Type.OBJECT, properties: { linkedin: { type: Type.STRING }, github: { type: Type.STRING }, portfolio: { type: Type.STRING } } },
            skills: { type: Type.ARRAY, items: { type: Type.STRING } },
            skillGroups: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { category: { type: Type.STRING }, items: { type: Type.ARRAY, items: { type: Type.STRING } } } } },
            projects: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, description: { type: Type.STRING }, technologies: { type: Type.ARRAY, items: { type: Type.STRING } }, highlights: { type: Type.ARRAY, items: { type: Type.STRING } }, link: { type: Type.STRING } } } },
            experience: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { role: { type: Type.STRING }, company: { type: Type.STRING }, duration: { type: Type.STRING }, description: { type: Type.STRING }, highlights: { type: Type.ARRAY, items: { type: Type.STRING } } } } },
            attachments: { type: Type.ARRAY, items: { type: Type.STRING } }, // matches frontend achievements push mapping
            education: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { school: { type: Type.STRING }, degree: { type: Type.STRING }, duration: { type: Type.STRING } } } },
            stats: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { value: { type: Type.STRING }, label: { type: Type.STRING } } } },
          },
        },
      },
    });

    const content = response.text.trim();
    const parsedAiData = JSON.parse(content);
    const optimizedPortfolio = purgeEmptyFormPayloads(cleanAndMergePortfolios(localFallbackPortfolio, parsedAiData));

    const persistentRecord = new UploadedResume({ userId: activeUserId, rawResumeText: text, ...optimizedPortfolio });
    const savedDoc = await persistentRecord.save();
    console.log(`[GEMINI ENGINE UPLOAD PERSISTED] Portfolio successfully mapped under ID: ${savedDoc._id}`);

    res.json({ success: true, resumeId: savedDoc._id, result: JSON.stringify(optimizedPortfolio) });
  } catch (err) {
    console.error("AI Generation structural processing fault occurred:", err.message);
    try {
      const fallbackRecord = await UploadedResume.create({ userId: activeUserId, rawResumeText: text, ...localFallbackPortfolio });
      res.json({ success: true, resumeId: fallbackRecord._id, result: JSON.stringify(localFallbackPortfolio) });
    } catch (dbErr) {
      res.status(500).json({ message: "System database write block occurred during data fallback mapping." });
    }
  }
};

/**
 * 2. GET UPLOADED RESUME PROFILE BY OBJECT ID
 */
export const getUploadedResume = async (req, res) => {
  try {
    const resumeData = await UploadedResume.findById(req.params.id);
    if (!resumeData) return res.status(404).json({ success: false, message: "Parsed data record not found." });
    if (resumeData.userId.toString() !== req.user.userId) return res.status(403).json({ success: false, message: "Unauthorized access authorization structure." });

    const cleanOutput = purgeEmptyFormPayloads(resumeData.toObject ? resumeData.toObject() : resumeData);
    res.status(200).json({ success: true, data: cleanOutput });
  } catch (err) {
    console.error("DATA FETCH BLOCK EXCEPTION:", err);
    res.status(500).json({ message: "Internal server data fallback retrieval breakdown." });
  }
};

/**
 * 3. CREATE MANUAL FORM INPUT RESUME RECORD (UPDATED FOR DEEP THEME PARSING)
 */
export const createManualResume = async (req, res) => {
  try {
    // 1. Isolate the deep configuration blocks to avoid purge helpers accidentally cleaning nested layers
    const { theme, ...restOfPayload } = req.body;
    
    // 2. Clear out any unselected properties in standard text inputs
    const fullyCleanedData = purgeEmptyFormPayloads(restOfPayload);
    
    // 3. Re-append the layout configuration data structure safely onto the constructor
    if (theme) {
      fullyCleanedData.theme = theme;
    }

    const resume = await Resume.create(fullyCleanedData);
    res.json({ success: true, resume });
  } catch (error) {
    console.error("Error creating manual entry resume layout document:", error);
    res.status(500).json({ success: false, message: "Failed to persist standard document profile." });
  }
};

/**
 * 4. GET ALL MANUALLY CREATED RESUMES
 */
export const getResumes = async (req, res) => {
  try {
    const resumes = await Resume.find().sort({ createdAt: -1 });
    res.json(resumes);
  } catch (error) {
    res.status(500).json({ message: "Error Fetching Resumes" });
  }
};

/**
 * 5. VIEW COMPILED PORTFOLIO RENDER LAYOUT
 */
export const viewResume = async (req, res) => {
  try {
    const id = req.params.id;
    let databaseObject = (await UploadedResume.findById(id)) || (await Resume.findById(id));
    if (!databaseObject) return res.status(404).send("Portfolio document not found across records.");

    const compiledData = purgeEmptyFormPayloads(databaseObject.toObject ? databaseObject.toObject() : databaseObject);
    const htmlOutput = compileUnifiedPortfolioHtml(compiledData);
    res.send(htmlOutput);
  } catch (error) {
    res.status(500).send("Error compiling portfolio runtime layout templates.");
  }
};

/**
 * 6. DOWNLOAD COMPILED PORTFOLIO LAYER
 */
export const downloadResume = async (req, res) => {
  try {
    const id = req.params.id;
    let databaseObject = (await UploadedResume.findById(id)) || (await Resume.findById(id));
    if (!databaseObject) return res.status(404).send("Portfolio structure reference not localized.");

    const compiledData = purgeEmptyFormPayloads(databaseObject.toObject ? databaseObject.toObject() : databaseObject);
    const htmlOutput = compileUnifiedPortfolioHtml(compiledData);

    res.setHeader("Content-Disposition", `attachment; filename=${compiledData.name || "Portfolio"}-portfolio.html`);
    res.setHeader("Content-Type", "text/html");
    res.send(htmlOutput);
  } catch (error) {
    res.status(500).send("Download template pipeline crashed.");
  }
};