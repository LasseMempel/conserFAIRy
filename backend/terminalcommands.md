# Terminal Commands for FastAPI Project Setup and Execution

## Prerequisites
Ensure you have Anaconda or Miniconda installed on your Ubuntu system.

---

## 1. Create Conda Environment from `fastapi-env.yml`
Use this command to create a new conda environment based on the specifications in your `fastapi-env.yml` file.

conda env create -f fastapi-env.yml

# Activate the environment you want to save (replace 'your_env_name' with the actual name)
conda activate your_env_name

# Export the environment
conda env export > fastapi-env.yml


# Activate the Environment
conda activate your_fastapi_env_name

# Run the Server with Uvicorn
python -m uvicorn app.app:app --reload