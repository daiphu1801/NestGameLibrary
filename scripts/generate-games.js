// Script to generate games list from ROM directories
// Run with: node generate-games.js

const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Load R2 public URL from .env
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL;

// Multiple image sources for better coverage
const LIBRETRO_BASE = 'https://thumbnails.libretro.com/Nintendo%20-%20Nintendo%20Entertainment%20System';
const IMAGE_SOURCES = {
    boxarts: `${LIBRETRO_BASE}/Named_Boxarts`,
    snaps: `${LIBRETRO_BASE}/Named_Snaps`,
    titles: `${LIBRETRO_BASE}/Named_Titles`,
    // Fallback: The Games DB API (if needed, requires API key)
    // Alternative: ScreenScraper (requires login)
};

const ROM_DIRS = [
    'Library nes/Nes ROMs Complete 1 Of 4',
    'Library nes/Nes ROMs Complete 2 Of 4',
    'Library nes/Nes ROMs Complete 3 Of 4',
    'Library nes/Nes ROMs Complete 4 Of 4'
];

// Category detection patterns
const CATEGORY_PATTERNS = {
    platformer: ['mario', 'mega man', 'rockman', 'adventure island', 'kirby', 'castlevania', 'ninja', 'kong', 'kid', 'boy', 'man', 'sonic', 'battletoads', 'tmnt', 'turtles', 'ducktales', 'chip', 'dale', 'contra', 'metroid'],
    rpg: ['final fantasy', 'dragon quest', 'dragon warrior', 'zelda', 'quest', 'rpg', 'fantasy', 'saga', 'souls', 'legend', 'ys', 'mother', 'earthbound', 'fire emblem', 'wizardry', 'ultima'],
    sports: ['baseball', 'soccer', 'football', 'tennis', 'golf', 'hockey', 'basketball', 'wrestling', 'boxing', 'olympic', 'sport', 'nba', 'nfl', 'mlb', 'world cup', 'pro yakyuu'],
    fighting: ['fighter', 'kung fu', 'karate', 'wrestling', 'punch', 'double dragon', 'street fighter', 'battle', 'kombat', 'warrior'],
    puzzle: ['tetris', 'puyo', 'puzzle', 'dr. mario', 'block', 'quiz', 'columns', 'match', 'lode runner', 'solomon'],
    racing: ['race', 'racing', 'rally', 'grand prix', 'f-1', 'f1', 'speed', 'turbo', 'excitebike', 'road', 'moto'],
    shooter: ['gradius', 'star', 'xevious', 'gun', 'shooter', 'force', 'wing', 'ship', 'space', 'galaga', 'galaxian', '1942', '1943', 'lifeforce', 'twinbee'],
    strategy: ['nobunaga', 'romance', 'war', 'strategy', 'tactics', 'chess', 'shogi', 'command', 'general', 'empire'],
    adventure: ['adventure', 'zelda', 'metroid', 'goonies', 'indiana', 'shadowgate', 'maniac mansion', 'detective', 'mystery']
};

// Featured games with descriptions
const FEATURED_GAMES = {
    'Super Mario Bros': { description: 'Game platform huyền thoại của Nintendo, cứu công chúa Peach khỏi Bowser.', rating: 5, year: 1985 },
    'Legend of Zelda': { description: 'Game phiêu lưu hành động kinh điển, Link cứu công chúa Zelda.', rating: 5, year: 1986 },
    'Mega Man': { description: 'Robot chiến đấu Mega Man đánh bại Dr. Wily và các robot masters.', rating: 5, year: 1987 },
    'Contra': { description: 'Game run-and-gun huyền thoại với chế độ 2 người chơi.', rating: 5, year: 1988 },
    'Final Fantasy': { description: 'RPG sử thi với 4 Warriors of Light cứu thế giới.', rating: 5, year: 1987 },
    'Tetris': { description: 'Game xếp hình huyền thoại, gây nghiện mọi thế hệ.', rating: 5, year: 1989 },
    'Castlevania': { description: 'Simon Belmont chiến đấu với Dracula trong lâu đài ma cà rồng.', rating: 5, year: 1986 },
    'Metroid': { description: 'Samus Aran khám phá hành tinh Zebes, đánh bại Mother Brain.', rating: 5, year: 1986 },
    'Ninja Gaiden': { description: 'Ryu Hayabusa trả thù cho cha với kỹ năng ninja siêu phàm.', rating: 5, year: 1988 },
    'Double Dragon': { description: 'Beat em up kinh điển, anh em Billy và Jimmy Lee cứu người yêu.', rating: 4, year: 1988 },
    'Punch-Out': { description: 'Game boxing với Little Mac thách đấu các võ sĩ huyền thoại.', rating: 5, year: 1987 },
    'Kirby': { description: 'Kirby hồng hút kẻ thù và sao chép khả năng của chúng.', rating: 5, year: 1993 },
    'Battletoads': { description: 'Game action khó nhất NES, 3 con cóc chiến đấu Dark Queen.', rating: 4, year: 1991 },
    'Dragon Quest': { description: 'RPG turn-based kinh điển của Nhật Bản.', rating: 5, year: 1986 },
    'Excitebike': { description: 'Game đua moto vượt địa hình với track editor.', rating: 4, year: 1984 },
    'Ice Climber': { description: 'Leo núi băng với Popo và Nana.', rating: 4, year: 1985 },
    'Gradius': { description: 'Shoot em up ngang huyền thoại của Konami.', rating: 5, year: 1986 },
    'Bomberman': { description: 'Đặt bom phá tường và tiêu diệt kẻ thù.', rating: 4, year: 1985 },
    'Pac-Man': { description: 'Ăn dots và tránh ma trong mê cung huyền thoại.', rating: 5, year: 1984 },
    'Galaga': { description: 'Bắn tàu vũ trụ ngoài hành tinh trong game arcade kinh điển.', rating: 5, year: 1985 }
};

// Extract region code from filename
function extractRegion(fileName) {
    const regionCodes = {
        '(J)': '🇯🇵 Japan',
        '(U)': '🇺🇸 USA',
        '(E)': '🇪🇺 Europe',
        '(G)': '🇩🇪 Germany',
        '(F)': '🇫🇷 France',
        '(I)': '🇮🇹 Italy',
        '(S)': '🇪🇸 Spain',
        '(SW)': '🇸🇪 Sweden',
        '(As)': '🌏 Asia',
        '(A)': '🇦🇺 Australia',
        '(K)': '🇰🇷 Korea',
        '(C)': '🇨🇳 China',
        '(HK)': '🇭🇰 Hong Kong',
        '(JU)': '🇯🇵🇺🇸 Japan/USA',
        '(JUE)': '🌍 Japan/USA/Europe',
        '(UE)': '🇺🇸🇪🇺 USA/Europe',
        '(PC10)': '🕹️ PlayChoice-10',
        '(VS)': '🕹️ VS System',
        '(Unl)': '🔓 Unlicensed',
        '(GC)': '🎮 Game Genie Code',
        '(KC)': '📦 Koei Classics',
        '[!]': '✅ Verified',
        '(Prototype)': '🧪 Prototype',
        '(Beta)': '🧪 Beta',
        '(PRG0)': '📦 Program Rev 0',
        '(PRG1)': '📦 Program Rev 1',
        '(Rev A)': '📦 Revision A',
        '(Rev B)': '📦 Revision B',
        '(Rev 1)': '📦 Revision 1',
        '(Rev 2)': '📦 Revision 2',
        '(Rev 3)': '📦 Revision 3'
    };

    const regions = [];
    for (const [code, name] of Object.entries(regionCodes)) {
        if (fileName.includes(code)) {
            regions.push(name);
        }
    }
    
    return regions.length > 0 ? regions.join(', ') : null;
}

function cleanGameName(fileName) {
    return fileName
        .replace(/\.(zip|nes|7z)$/i, '')
        .replace(/\s*\([^)]*\)\s*/g, ' ')
        .replace(/\s*\[[^\]]*\]\s*/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

// Generate multiple Libretro thumbnail URLs from filename with fallbacks
function generateImageUrls(fileName) {
    // Remove extension
    const nameWithoutExt = fileName.replace(/\.(zip|nes|7z)$/i, '');
    
    // Map region codes to Libretro format
    const regionMap = {
        '(J)': '(Japan)',
        '(U)': '(USA)',
        '(E)': '(Europe)',
        '(G)': '(Germany)',
        '(F)': '(France)',
        '(I)': '(Italy)',
        '(S)': '(Spain)',
        '(SW)': '(Sweden)',
        '(As)': '(Asia)',
        '(A)': '(Australia)',
        '(K)': '(Korea)',
        '(C)': '(China)',
        '(HK)': '(Hong Kong)',
        '(JU)': '(Japan, USA)',
        '(JUE)': '(Japan, USA, Europe)',
        '(UE)': '(USA, Europe)',
        '(PC10)': '(USA) (PC10)',
        '(VS)': '(VS)',
        '(Unl)': '(USA) (Unl)',
        '[!]': '',
        '(Prototype)': '(Proto)',
        '(Beta)': '(Beta)',
        '(PRG0)': '',
        '(PRG1)': '',
        '(Rev A)': '',
        '(Rev B)': '',
        '(Rev 1)': '',
        '(Rev 2)': '',
        '(Rev 3)': ''
    };
    
    let imageName = nameWithoutExt;
    
    // Replace region codes with Libretro format
    for (const [code, replacement] of Object.entries(regionMap)) {
        imageName = imageName.replace(code, replacement);
    }
    
    // Clean up extra spaces
    imageName = imageName.replace(/\s+/g, ' ').trim();
    
    // URL encode
    const encodedName = encodeURIComponent(imageName);
    
    // Generate URLs from all sources for fallback
    return [
        `${IMAGE_SOURCES.boxarts}/${encodedName}.png`,
        `${IMAGE_SOURCES.snaps}/${encodedName}.png`,
        `${IMAGE_SOURCES.titles}/${encodedName}.png`
    ];
}

function detectCategory(name) {
    const lowerName = name.toLowerCase();

    for (const [category, patterns] of Object.entries(CATEGORY_PATTERNS)) {
        for (const pattern of patterns) {
            if (lowerName.includes(pattern)) {
                return category;
            }
        }
    }

    return 'other';
}

function findFeaturedInfo(name) {
    const lowerName = name.toLowerCase();

    for (const [featuredName, info] of Object.entries(FEATURED_GAMES)) {
        if (lowerName.includes(featuredName.toLowerCase())) {
            return info;
        }
    }

    return null;
}

function generateDescription(category) {
    const descriptions = {
        platformer: 'Game hành động platform hấp dẫn.',
        rpg: 'Game nhập vai với câu chuyện sâu sắc.',
        sports: 'Game thể thao vui nhộn.',
        fighting: 'Game đối kháng kịch tính.',
        puzzle: 'Game giải đố thử thách trí tuệ.',
        racing: 'Game đua xe tốc độ.',
        shooter: 'Game bắn súng hành động.',
        strategy: 'Game chiến thuật đòi hỏi tư duy.',
        adventure: 'Game phiêu lưu khám phá.',
        other: 'Game NES kinh điển.'
    };

    return descriptions[category] || descriptions.other;
}

function generateGamesList() {
    const games = [];
    let id = 1;

    for (const dir of ROM_DIRS) {
        const dirPath = path.join(__dirname, '..', dir);

        if (!fs.existsSync(dirPath)) {
            console.log(`Directory not found: ${dir}`);
            continue;
        }

        const files = fs.readdirSync(dirPath);

        for (const file of files) {
            if (file.endsWith('.zip') || file.endsWith('.nes') || file.endsWith('.7z')) {
                const gameName = cleanGameName(file);
                const category = detectCategory(gameName);
                const featured = findFeaturedInfo(gameName);
                const region = extractRegion(file);

                // Create description with region info
                let description = featured?.description || generateDescription(category);
                if (region) {
                    description += ` Region: ${region}`;
                }

                // Get multiple image URLs for fallback
                const imageUrls = generateImageUrls(file);

                games.push({
                    id: id++,
                    name: gameName,
                    fileName: file,
                    path: `${R2_PUBLIC_URL}/${file}`,
                    category: category,
                    description: description,
                    rating: featured?.rating || Math.floor(Math.random() * 2) + 3,
                    year: featured?.year || null,
                    isFeatured: !!featured,
                    region: region,
                    image: imageUrls[0],  // Primary image (boxart)
                    imageSnap: imageUrls[1],  // Screenshot fallback
                    imageTitle: imageUrls[2]  // Title screen fallback
                });
            }
        }
    }

    // Sort alphabetically
    games.sort((a, b) => a.name.localeCompare(b.name));

    return games;
}

// Generate and save
const games = generateGamesList();
const output = `// Auto-generated games list with images
// Generated at: ${new Date().toISOString()}
// Total games: ${games.length}
// Images source: Libretro Thumbnails (https://thumbnails.libretro.com/)
// ROMs source: Cloudflare R2 (${R2_PUBLIC_URL})

const GAMES_DATA = ${JSON.stringify(games, null, 2)};
`;

// Save to assets/data/
const outputPath = path.join(__dirname, '..', 'assets', 'data', 'games.js');
fs.writeFileSync(outputPath, output);
console.log(`Generated ${outputPath} with ${games.length} games`);

// Also create a JSON version
const jsonPath = path.join(__dirname, '..', 'assets', 'data', 'games.json');
fs.writeFileSync(jsonPath, JSON.stringify(games, null, 2));
console.log(`Generated ${jsonPath}`);
