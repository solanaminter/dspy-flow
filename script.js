document.addEventListener('DOMContentLoaded', () => {
    const bubbles = document.querySelectorAll('.bubble');
    const arrows = document.querySelectorAll('.arrow');
    const popup = document.getElementById('popup');
    const popupTitle = document.getElementById('popup-title');
    const popupBody = document.getElementById('popup-body');
    const closeBtn = document.querySelector('.close');

    const steps = [
        {
            title: "1. Setup and Configuration",
            content: `
                <p>This step sets up the environment and configures the language model.</p>
                <h3>Code:</h3>
                <pre>
import dspy
from dspy.datasets import Dataset

# Configure the language model
turbo = dspy.OpenAI(model='gpt-3.5-turbo')
dspy.settings.configure(lm=turbo)
                </pre>
                <h3>Input:</h3>
                <p>None (importing libraries and configuring settings)</p>
                <h3>Output:</h3>
                <p>Configured environment ready for use</p>
            `
        },
        {
            title: "2. Define the Signature",
            content: `
                <p>This step defines the structure of our sentiment analysis task.</p>
                <h3>Code:</h3>
                <pre>
class SentimentAnalysis(dspy.Signature):
    """Analyze the sentiment of a given review."""
    review = dspy.InputField(desc="The review text to analyze")
    sentiment = dspy.OutputField(desc="The sentiment of the review (Positive/Negative)")

predict_sentiment = dspy.Predict(SentimentAnalysis)
                </pre>
                <h3>Input:</h3>
                <p>Signature definition</p>
                <h3>Output:</h3>
                <p>SentimentAnalysis signature and predict_sentiment predictor</p>
            `
        },
        {
            title: "3. Prepare Training Data",
            content: `
                <p>This step creates datasets for training and evaluation.</p>
                <h3>Code:</h3>
                <pre>
train_data = [
    dspy.Example(review="I love this product!", sentiment="Positive").with_inputs("review"),
    dspy.Example(review="This is the worst experience ever.", sentiment="Negative").with_inputs("review"),
    dspy.Example(review="It's okay, nothing special.", sentiment="Neutral").with_inputs("review"),
]

eval_data = [
    dspy.Example(review="The service was excellent!", sentiment="Positive").with_inputs("review"),
    dspy.Example(review="I'm disappointed with the quality.", sentiment="Negative").with_inputs("review"),
]

trainset = Dataset(train_data)
devset = Dataset(eval_data)
                </pre>
                <h3>Input:</h3>
                <p>Example reviews and sentiments</p>
                <h3>Output:</h3>
                <p>trainset and devset datasets</p>
            `
        },
        {
            title: "4. Define Evaluation Metric",
            content: `
                <p>This step defines how we'll measure the model's performance.</p>
                <h3>Code:</h3>
                <pre>
def sentiment_metric(example, prediction):
    return float(example.sentiment == prediction.sentiment)
                </pre>
                <h3>Input:</h3>
                <p>example (true data) and prediction (model output)</p>
                <h3>Output:</h3>
                <p>1.0 if the sentiments match, 0.0 otherwise</p>
            `
        },
        {
            title: "5. Create and Configure Optimizer",
            content: `
                <p>This step sets up an optimizer to refine the prompts.</p>
                <h3>Code:</h3>
                <pre>
optimizer = dspy.BootstrapFewShot(metric=sentiment_metric)
                </pre>
                <h3>Input:</h3>
                <p>Evaluation metric</p>
                <h3>Output:</h3>
                <p>Configured optimizer object</p>
                <h3>Types of Optimizers:</h3>
                <ul>
                    <li><strong>BootstrapFewShot:</strong> Basic optimizer for small datasets (~10 examples)</li>
                    <li><strong>BootstrapFewShotWithRandomSearch:</strong> Good default choice for datasets of ~50 examples</li>
                    <li><strong>MIPRO:</strong> Suitable for larger datasets (300+ examples)</li>
                    <li><strong>BootstrapFinetune:</strong> Fine-tunes language model weights</li>
                    <li><strong>COPRO:</strong> Generates and refines instructions for each step</li>
                    <li><strong>Ensemble:</strong> Combines multiple DSPy programs</li>
                    <li><strong>Automatic Few-Shot:</strong> Optimizes selection of few-shot examples</li>
                    <li><strong>Automatic Instruction Optimization:</strong> Focuses on generating and refining instructions</li>
                </ul>
            `
        },
        {
            title: "6. Compile the Predictor",
            content: `
                <p>This step uses the optimizer to compile our predictor.</p>
                <h3>Code:</h3>
                <pre>
compiled_predictor = optimizer.compile(predict_sentiment, trainset=trainset)
                </pre>
                <h3>Input:</h3>
                <p>predict_sentiment function and trainset</p>
                <h3>Output:</h3>
                <p>Compiled predictor optimized based on training data</p>
            `
        },
        {
            title: "7. Evaluate the Compiled Predictor",
            content: `
                <p>This step evaluates our compiled predictor on the dev set.</p>
                <h3>Code:</h3>
                <pre>
from dspy.evaluate import Evaluate

evaluator = Evaluate(devset=devset, metric=sentiment_metric)
results = evaluator(compiled_predictor)
print(f"Accuracy: {results['metric']:.2f}")
                </pre>
                <h3>Input:</h3>
                <p>compiled_predictor, devset, and sentiment_metric</p>
                <h3>Output:</h3>
                <p>Accuracy score (e.g., "Accuracy: 1.00")</p>
            `
        },
        {
            title: "8. Use the Compiled Predictor",
            content: `
                <p>This step demonstrates using the compiled predictor on new data.</p>
                <h3>Code:</h3>
                <pre>
new_review = "The product exceeded my expectations."
result = compiled_predictor(review=new_review)
print(f"Review: {new_review}")
print(f"Predicted Sentiment: {result.sentiment}")
                </pre>
                <h3>Input:</h3>
                <p>New review text</p>
                <h3>Output:</h3>
                <p>Predicted sentiment (e.g., "Predicted Sentiment: Positive")</p>
            `
        }
    ];

    function animateFlow() {
        bubbles.forEach((bubble, index) => {
            setTimeout(() => {
                bubble.style.animation = 'pulse 2s infinite';
                if (arrows[index]) {
                    arrows[index].style.animation = 'arrow-pulse 2s infinite';
                }
            }, index * 300);
        });
    }

    animateFlow();
    setInterval(animateFlow, bubbles.length * 300 + 2000);

    bubbles.forEach((bubble, index) => {
        bubble.addEventListener('click', () => {
            popupTitle.textContent = steps[index].title;
            popupBody.innerHTML = steps[index].content;
            popup.style.display = 'block';
            setTimeout(() => {
                popup.querySelector('.popup-content').style.opacity = '1';
                popup.querySelector('.popup-content').style.transform = 'translateY(0)';
            }, 50);
        });
    });

    closeBtn.addEventListener('click', closePopup);
    window.addEventListener('click', (event) => {
        if (event.target === popup) {
            closePopup();
        }
    });

    function closePopup() {
        popup.querySelector('.popup-content').style.opacity = '0';
        popup.querySelector('.popup-content').style.transform = 'translateY(-50px)';
        setTimeout(() => {
            popup.style.display = 'none';
        }, 300);
    }
});