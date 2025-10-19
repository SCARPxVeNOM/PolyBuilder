export interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  xpReward: number;
  category: string;
  initialCode: string;
  solution: string;
  testCases: {
    input: string;
    expectedOutput: string;
  }[];
  hints: string[];
}

export const CHALLENGES: Challenge[] = [
  {
    id: "first-contract",
    title: "Your First Smart Contract",
    description: "Create a simple storage contract that can store and retrieve a number.",
    difficulty: "beginner",
    xpReward: 100,
    category: "Solidity Basics",
    initialCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SimpleStorage {
    // TODO: Add a state variable to store a number
    
    // TODO: Add a function to store a number
    
    // TODO: Add a function to retrieve the stored number
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SimpleStorage {
    uint256 private storedData;
    
    function set(uint256 x) public {
        storedData = x;
    }
    
    function get() public view returns (uint256) {
        return storedData;
    }
}`,
    testCases: [
      {
        input: "set(42)",
        expectedOutput: "get() should return 42",
      },
    ],
    hints: [
      "Use uint256 for storing numbers",
      "The set function should be public",
      "The get function should be public view",
    ],
  },
  {
    id: "counter-contract",
    title: "Build a Counter",
    description: "Create a contract that can increment and decrement a counter.",
    difficulty: "beginner",
    xpReward: 150,
    category: "Solidity Basics",
    initialCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Counter {
    // TODO: Add a counter variable
    
    // TODO: Add increment function
    
    // TODO: Add decrement function
    
    // TODO: Add get function
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Counter {
    uint256 public count;
    
    function increment() public {
        count += 1;
    }
    
    function decrement() public {
        require(count > 0, "Counter cannot be negative");
        count -= 1;
    }
    
    function getCount() public view returns (uint256) {
        return count;
    }
}`,
    testCases: [
      {
        input: "increment() x3",
        expectedOutput: "count should be 3",
      },
      {
        input: "decrement()",
        expectedOutput: "count should be 2",
      },
    ],
    hints: [
      "Initialize count to 0",
      "Use require() to prevent negative values",
      "Use public visibility for the count variable",
    ],
  },
  {
    id: "greeting-contract",
    title: "Greeting Contract",
    description: "Create a contract that stores and updates a greeting message.",
    difficulty: "beginner",
    xpReward: 150,
    category: "Solidity Basics",
    initialCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Greeting {
    // TODO: Add a greeting variable
    
    // TODO: Add constructor to set initial greeting
    
    // TODO: Add function to update greeting
    
    // TODO: Add function to get greeting
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Greeting {
    string private greeting;
    
    constructor(string memory _greeting) {
        greeting = _greeting;
    }
    
    function setGreeting(string memory _greeting) public {
        greeting = _greeting;
    }
    
    function getGreeting() public view returns (string memory) {
        return greeting;
    }
}`,
    testCases: [
      {
        input: 'constructor("Hello World")',
        expectedOutput: 'getGreeting() should return "Hello World"',
      },
    ],
    hints: [
      "Use string type for text",
      "Constructor runs once when contract is deployed",
      "Use memory keyword for string parameters",
    ],
  },
  {
    id: "ownership-contract",
    title: "Ownership Pattern",
    description: "Implement a basic ownership pattern with access control.",
    difficulty: "intermediate",
    xpReward: 200,
    category: "Access Control",
    initialCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Ownable {
    // TODO: Add owner variable
    
    // TODO: Add constructor to set owner
    
    // TODO: Add onlyOwner modifier
    
    // TODO: Add restricted function
}`,
    solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Ownable {
    address public owner;
    
    constructor() {
        owner = msg.sender;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }
    
    function restrictedFunction() public onlyOwner {
        // Only owner can call this
    }
}`,
    testCases: [
      {
        input: "owner calls restrictedFunction()",
        expectedOutput: "Should succeed",
      },
      {
        input: "non-owner calls restrictedFunction()",
        expectedOutput: "Should revert",
      },
    ],
    hints: [
      "Use address type for owner",
      "msg.sender is the address calling the function",
      "Modifiers run before function execution",
    ],
  },
];

export class ChallengeManager {
  private storageKey = "polygon-scaffold-challenges";

  getCompletedChallenges(): string[] {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : [];
  }

  completeChallenge(challengeId: string): void {
    const completed = this.getCompletedChallenges();
    if (!completed.includes(challengeId)) {
      completed.push(challengeId);
      localStorage.setItem(this.storageKey, JSON.stringify(completed));
    }
  }

  isChallengeCompleted(challengeId: string): boolean {
    return this.getCompletedChallenges().includes(challengeId);
  }
}

