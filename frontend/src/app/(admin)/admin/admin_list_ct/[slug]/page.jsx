'use client'
import { useState, useEffect } from "react";
import axios from "axios";
import toast from 'react-hot-toast';
import Loading from "../../../../../components/Loading/Loading";

function EditCategory({ params }) {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name_ct: '',
        tag_ct: '',
        image: null,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/categories/${params.slug}`);
                setData(response.data);
                setFormData({
                    name_ct: response.data.name_ct,
                    tag_ct: response.data.tag_ct,
                    image: null,
                });
            } catch (error) {
                console.error('Error fetching category data:', error);
                setError('Error fetching category data');
            }
            setLoading(false);
        };
        fetchData();
    }, [params.slug]);

    if (loading) {
        return <div><Loading /></div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: files ? files[0] : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedFormData = new FormData();
        updatedFormData.append('name_ct', formData.name_ct);
        updatedFormData.append('tag_ct', formData.tag_ct);
        if (formData.image) {
            updatedFormData.append('image', formData.image);
        }

        try {
            await axios.put(`http://localhost:3000/categories/edit/${params.slug}`, updatedFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            toast.success('Category updated successfully');
        } catch (error) {
            console.error('Error updating category:', error);
            toast.error('Error updating category');
        }
    };

    return (
        <div className="text-black">
            <div className="font-bold text-3xl mb-2">
                # {data?._id}
            </div>
            <div className="bg-white w-full p-4 rounded-lg">
                <form onSubmit={handleSubmit}>
                    <div className="sm:col-span-3 mb-4">
                        <label htmlFor="name_ct" className="block text-sm font-medium leading-6 text-gray-900">
                            Name category
                        </label>
                        <div className="mt-2">
                            <input
                                id="name_ct"
                                name="name_ct"
                                type="text"
                                value={formData.name_ct}
                                onChange={handleChange}
                                className="block px-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    <div className="sm:col-span-3 mb-4">
                        <label htmlFor="tag_ct" className="block text-sm font-medium leading-6 text-gray-900">
                            Tag category
                        </label>
                        <div className="mt-2">
                            <input
                                id="tag_ct"
                                name="tag_ct"
                                type="text"
                                value={formData.tag_ct}
                                onChange={handleChange}
                                className="block px-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="formFileMultiple" className="block text-sm font-medium leading-6 text-gray-900 mb-2">
                            Image category
                        </label>
                        <input
                            className="relative m-0 block w-full min-w-0 flex-auto cursor-pointer rounded border border-solid border-secondary-500 bg-transparent bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-surface transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:me-3 file:cursor-pointer file:overflow-hidden file:rounded-none file:border-0 file:border-e file:border-solid file:border-inherit file:bg-transparent file:px-3 file:py-[0.32rem] file:text-surface focus:border-primary focus:text-gray-700 focus:shadow-inset focus:outline-none dark:border-white/70 dark:text-white file:dark:text-white"
                            type="file"
                            id="formFileMultiple"
                            name="image"
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <button type="submit" className='w-full py-3 bg-primary rounded-lg font-semibold text-white hover:bg-orange-300'>
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditCategory;
